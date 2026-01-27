import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrganizationStatus, OrganizationType } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    type?: OrganizationType;
    status?: OrganizationStatus;
    talukId?: string;
    page?: number;
    limit?: number;
  }) {
    const { type, status, talukId, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (type) where.type = type;
    if (status) where.status = status;
    if (talukId) where.talukId = talukId;

    const [organizations, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          taluk: { select: { code: true, name: true } },
          _count: { select: { members: true, tournaments: true } },
        },
      }),
      this.prisma.organization.count({ where }),
    ]);

    return {
      data: organizations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const org = await this.prisma.organization.findUnique({
      where: { slug },
      include: {
        taluk: true,
        officeBearers: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { members: true, tournaments: true } },
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async create(data: any, userId: string) {
    const slug = slugify(data.name, { lower: true, strict: true });

    return this.prisma.organization.create({
      data: {
        ...data,
        slug,
        createdById: userId,
        status: OrganizationStatus.PENDING,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  async approve(id: string, approvedById: string) {
    return this.prisma.organization.update({
      where: { id },
      data: {
        status: OrganizationStatus.APPROVED,
        approvedAt: new Date(),
        approvedById,
      },
    });
  }

  async reject(id: string, reason: string) {
    return this.prisma.organization.update({
      where: { id },
      data: {
        status: OrganizationStatus.REJECTED,
        rejectionReason: reason,
      },
    });
  }

  // Office Bearers
  async getOfficeBearers(orgId: string) {
    return this.prisma.officeBearer.findMany({
      where: { organizationId: orgId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async addOfficeBearer(orgId: string, data: any) {
    return this.prisma.officeBearer.create({
      data: {
        ...data,
        organizationId: orgId,
      },
    });
  }

  async updateOfficeBearer(id: string, data: any) {
    return this.prisma.officeBearer.update({
      where: { id },
      data,
    });
  }

  async removeOfficeBearer(id: string) {
    return this.prisma.officeBearer.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
