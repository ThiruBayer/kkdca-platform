import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus, ContentType } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    type?: ContentType;
    status?: ContentStatus;
    showOnHome?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { type, status, showOnHome, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (type) where.type = type;
    if (status) where.status = status;
    if (showOnHome !== undefined) where.showOnHome = showOnHome;

    const [content, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
        include: {
          author: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.content.count({ where }),
    ]);

    return {
      data: content,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const content = await this.prisma.content.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    // Increment view count
    await this.prisma.content.update({
      where: { id: content.id },
      data: { viewCount: { increment: 1 } },
    });

    return content;
  }

  async create(data: any, authorId: string) {
    const slug = slugify(`${data.title}-${Date.now()}`, { lower: true, strict: true });

    return this.prisma.content.create({
      data: {
        ...data,
        slug,
        authorId,
        status: data.status || ContentStatus.DRAFT,
        publishedAt: data.status === ContentStatus.PUBLISHED ? new Date() : null,
      },
    });
  }

  async update(id: string, data: any) {
    const updateData: any = { ...data };

    if (data.status === ContentStatus.PUBLISHED) {
      const existing = await this.prisma.content.findUnique({ where: { id } });
      if (existing && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    return this.prisma.content.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return this.prisma.content.update({
      where: { id },
      data: { deletedAt: new Date(), status: ContentStatus.ARCHIVED },
    });
  }

  async getHomepageData() {
    const [
      hero,
      announcements,
      news,
      stats,
    ] = await Promise.all([
      // Hero banner
      this.prisma.content.findFirst({
        where: { type: ContentType.BANNER, status: ContentStatus.PUBLISHED, showOnHome: true },
        orderBy: { sortOrder: 'asc' },
      }),
      // Announcements
      this.prisma.content.findMany({
        where: { type: ContentType.ANNOUNCEMENT, status: ContentStatus.PUBLISHED },
        take: 5,
        orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
      }),
      // News
      this.prisma.content.findMany({
        where: { type: ContentType.NEWS, status: ContentStatus.PUBLISHED },
        take: 6,
        orderBy: { publishedAt: 'desc' },
      }),
      // Stats
      Promise.all([
        this.prisma.user.count({ where: { status: 'ACTIVE', role: { in: ['PLAYER', 'ARBITER'] } } }),
        this.prisma.tournament.count({ where: { status: { not: 'CANCELLED' } } }),
        this.prisma.organization.count({ where: { status: 'APPROVED', type: 'ACADEMY' } }),
        this.prisma.taluk.count({ where: { isActive: true } }),
      ]),
    ]);

    return {
      hero,
      announcements,
      news,
      stats: {
        totalPlayers: stats[0],
        totalTournaments: stats[1],
        totalAcademies: stats[2],
        totalTaluks: stats[3],
      },
    };
  }
}
