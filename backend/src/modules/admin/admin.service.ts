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

  async rejectTournament(tournamentId: string, reason: string) {
    return this.prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        status: TournamentStatus.CANCELLED,
        rejectionReason: reason,
      },
    });
  }

  async getAllPayments(params: {
    search?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, status, from, to, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to + 'T23:59:59');
    }
    if (search) {
      where.OR = [
        { gatewayOrderId: { contains: search, mode: 'insensitive' } },
        { receiptNo: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [payments, total, successAgg, pendingAgg, failedAgg] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true, kdcaId: true } },
        },
      }),
      this.prisma.payment.count({ where }),
      this.prisma.payment.aggregate({ where: { ...where, status: 'SUCCESS' }, _sum: { amount: true } }),
      this.prisma.payment.aggregate({ where: { ...where, status: 'PENDING' }, _sum: { amount: true } }),
      this.prisma.payment.aggregate({ where: { ...where, status: 'FAILED' }, _sum: { amount: true } }),
    ]);

    const successTotal = successAgg._sum.amount || 0;
    const pendingTotal = pendingAgg._sum.amount || 0;
    const failedTotal = failedAgg._sum.amount || 0;

    return {
      data: payments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), pages: Math.ceil(total / limit) },
      summary: {
        total: Number(successTotal) + Number(pendingTotal) + Number(failedTotal),
        success: Number(successTotal),
        pending: Number(pendingTotal),
        failed: Number(failedTotal),
      },
    };
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

    const total = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

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
    const publicKeys = [
      'site_name', 'site_tagline', 'contact_email', 'contact_phone', 'address',
      'membership_fee_player', 'membership_fee_arbiter',
      'allow_player_registration', 'allow_academy_registration', 'registration_login_enabled',
    ];
    const isPublic = publicKeys.includes(key);
    return this.prisma.setting.upsert({
      where: { key },
      update: { value, isPublic },
      create: {
        key,
        value,
        valueType: typeof value === 'boolean' ? 'boolean' : 'string',
        isPublic,
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
