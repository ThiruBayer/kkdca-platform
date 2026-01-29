import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserStatus, UserRole, OrganizationStatus, TournamentStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      activeMembers,
      pendingApprovals,
      totalRevenue,
      revenueThisMonth,
      recentActivities,
      pendingOrgs,
      pendingTournaments,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({
        where: { status: UserStatus.ACTIVE, membershipStatus: 'ACTIVE' },
      }),
      this.prisma.user.count({ where: { status: UserStatus.PENDING } }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS', completedAt: { gte: thisMonth } },
        _sum: { amount: true },
      }),
      this.prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.organization.count({
        where: { status: OrganizationStatus.PENDING },
      }),
      this.prisma.tournament.count({
        where: { status: TournamentStatus.PENDING_APPROVAL },
      }),
    ]);

    return {
      stats: {
        totalUsers,
        activeMembers,
        pendingApprovals,
        totalRevenue: totalRevenue._sum.amount || 0,
        revenueThisMonth: revenueThisMonth._sum.amount || 0,
        pendingOrganizations: pendingOrgs,
        pendingTournaments: pendingTournaments,
      },
      recentActivities,
    };
  }

  async getAllUsers(params: {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { role, status, search, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { kdcaId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          kdcaId: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          membershipStatus: true,
          createdAt: true,
          taluk: { select: { name: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateUserStatus(userId: string, status: UserStatus, reason?: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }

  async approveArbiter(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role: UserRole.ARBITER,
        status: UserStatus.ACTIVE,
      },
    });
  }

  async approveOrganization(orgId: string, approvedById: string) {
    return this.prisma.organization.update({
      where: { id: orgId },
      data: {
        status: OrganizationStatus.APPROVED,
        approvedAt: new Date(),
        approvedById,
      },
    });
  }

  async rejectOrganization(orgId: string, reason: string) {
    return this.prisma.organization.update({
      where: { id: orgId },
      data: {
        status: OrganizationStatus.REJECTED,
        rejectionReason: reason,
      },
    });
  }

  async approveTournament(tournamentId: string, approvedById: string) {
    return this.prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        status: TournamentStatus.APPROVED,
        approvedAt: new Date(),
        approvedById,
      },
    });
  }

  async getPaymentReports(from: Date, to: Date) {
    const payments = await this.prisma.payment.findMany({
      where: {
        status: 'SUCCESS',
        completedAt: { gte: from, lte: to },
      },
      include: {
        user: { select: { firstName: true, lastName: true, kdcaId: true } },
      },
      orderBy: { completedAt: 'desc' },
    });

    const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      payments,
      summary: {
        total,
        count: payments.length,
        period: { from, to },
      },
    };
  }

  async getSettings() {
    const settings = await this.prisma.setting.findMany({
      orderBy: { key: 'asc' },
    });
    return { data: settings };
  }

  async updateSetting(key: string, value: any) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value,
        valueType: typeof value === 'boolean' ? 'boolean' : 'string',
        isPublic: false,
      },
    });
  }

  async getAuditLogs(params: {
    userId?: string;
    action?: string;
    page?: number;
    limit?: number;
  }) {
    const { userId, action, page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
