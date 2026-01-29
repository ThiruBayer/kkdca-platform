import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TournamentStatus, RegistrationStatus } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    status?: TournamentStatus;
    level?: string;
    organizationId?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, level, organizationId, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (status) where.status = status;
    if (level) where.level = level;
    if (organizationId) where.organizationId = organizationId;

    const [tournaments, total] = await Promise.all([
      this.prisma.tournament.findMany({
        where,
        skip,
        take: limit,
        orderBy: { tournamentStart: 'desc' },
        include: {
          organization: { select: { id: true, name: true, logoUrl: true } },
        },
      }),
      this.prisma.tournament.count({ where }),
    ]);

    return {
      data: tournaments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { slug },
      include: {
        organization: { select: { id: true, name: true, logoUrl: true, slug: true } },
        _count: { select: { registrations: true } },
      },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    return tournament;
  }

  async create(data: any, organizationId: string) {
    const slug = slugify(`${data.name}-${Date.now()}`, { lower: true, strict: true });

    return this.prisma.tournament.create({
      data: {
        ...data,
        slug,
        organizationId,
        status: TournamentStatus.DRAFT,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.tournament.update({
      where: { id },
      data,
    });
  }

  async submitForApproval(id: string) {
    return this.prisma.tournament.update({
      where: { id },
      data: {
        status: TournamentStatus.PENDING_APPROVAL,
        submittedAt: new Date(),
      },
    });
  }

  async approve(id: string, approvedById: string) {
    return this.prisma.tournament.update({
      where: { id },
      data: {
        status: TournamentStatus.APPROVED,
        approvedAt: new Date(),
        approvedById,
      },
    });
  }

  async openRegistration(id: string) {
    return this.prisma.tournament.update({
      where: { id },
      data: { status: TournamentStatus.REGISTRATION_OPEN },
    });
  }

  // Registrations
  async register(tournamentId: string, userId: string, category: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    if (tournament.status !== TournamentStatus.REGISTRATION_OPEN) {
      throw new BadRequestException('Registration is not open');
    }

    // Check if already registered
    const existing = await this.prisma.tournamentRegistration.findUnique({
      where: {
        tournamentId_userId: { tournamentId, userId },
      },
    });

    if (existing) {
      throw new BadRequestException('Already registered for this tournament');
    }

    // Create registration
    const registration = await this.prisma.tournamentRegistration.create({
      data: {
        tournamentId,
        userId,
        category: category as any,
        status: RegistrationStatus.PENDING,
      },
    });

    // Increment count
    await this.prisma.tournament.update({
      where: { id: tournamentId },
      data: { currentCount: { increment: 1 } },
    });

    return registration;
  }

  async getRegistrations(tournamentId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      this.prisma.tournamentRegistration.findMany({
        where: { tournamentId },
        skip,
        take: limit,
        orderBy: { registeredAt: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              kdcaId: true,
              firstName: true,
              lastName: true,
              profile: { select: { photoUrl: true, aicfRating: true } },
            },
          },
        },
      }),
      this.prisma.tournamentRegistration.count({ where: { tournamentId } }),
    ]);

    return {
      data: registrations,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateResults(tournamentId: string, results: any[]) {
    const updates = results.map((result) =>
      this.prisma.tournamentRegistration.update({
        where: { id: result.registrationId },
        data: {
          rank: result.rank,
          score: result.score,
          tiebreak1: result.tiebreak1,
          tiebreak2: result.tiebreak2,
          prize: result.prize,
        },
      }),
    );

    await this.prisma.$transaction(updates);

    return { message: 'Results updated successfully' };
  }

  async publishResults(id: string) {
    return this.prisma.tournament.update({
      where: { id },
      data: {
        status: TournamentStatus.COMPLETED,
        resultsPublished: true,
      },
    });
  }
}
