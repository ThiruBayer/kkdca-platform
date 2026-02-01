import { Controller, Get, Post, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(private prisma: PrismaService) {}

  @Get('taluks')
  @ApiOperation({ summary: 'Get all taluks' })
  async getTaluks() {
    return this.prisma.taluk.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        nameTamil: true,
      },
    });
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get public settings' })
  async getSettings() {
    const settings = await this.prisma.setting.findMany({
      where: { isPublic: true },
    });

    return settings.reduce((acc: Record<string, any>, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get public statistics' })
  async getStats() {
    const [players, tournaments, academies, taluks] = await Promise.all([
      this.prisma.user.count({
        where: { status: 'ACTIVE', role: { in: ['PLAYER', 'ARBITER'] } },
      }),
      this.prisma.tournament.count({
        where: { status: { not: 'CANCELLED' } },
      }),
      this.prisma.organization.count({
        where: { status: 'APPROVED', type: 'ACADEMY' },
      }),
      this.prisma.taluk.count({ where: { isActive: true } }),
    ]);

    return {
      totalPlayers: players,
      totalTournaments: tournaments,
      totalAcademies: academies,
      totalTaluks: taluks,
    };
  }

  @Get('downloads')
  @ApiOperation({ summary: 'Get downloadable resources' })
  async getDownloads() {
    // Return static download links
    return [
      {
        id: '1',
        title: 'District Tournament Bid Form',
        description: 'Form for bidding to host district tournaments',
        fileUrl: '/downloads/district-tournament-bidform.pdf',
        category: 'forms',
      },
      {
        id: '2',
        title: 'State Tournament Bid Form',
        description: 'Form for bidding to host state tournaments',
        fileUrl: '/downloads/state-tournament-bidform.pdf',
        category: 'forms',
      },
      {
        id: '3',
        title: 'Laws of Chess',
        description: 'FIDE Laws of Chess',
        fileUrl: '/downloads/laws-of-chess.pdf',
        category: 'rules',
      },
    ];
  }

  @Post('contact')
  @ApiOperation({ summary: 'Submit contact form' })
  async submitContact(
    @Body() data: { name: string; email: string; subject: string; message: string },
  ) {
    return {
      success: true,
      message: 'Your message has been received. We will get back to you soon.',
    };
  }

  @Get('player-lookup/:kdcaId')
  @ApiOperation({ summary: 'Look up player by KKDCA ID' })
  async playerLookup(@Param('kdcaId') kdcaId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        kdcaId: kdcaId.toUpperCase(),
        deletedAt: null,
      },
      select: {
        id: true,
        kdcaId: true,
        firstName: true,
        lastName: true,
        role: true,
        taluk: { select: { name: true, code: true } },
        profile: {
          select: {
            fideId: true,
            aicfId: true,
            tncaId: true,
            fideRatingStd: true,
            fideRatingRapid: true,
            fideRatingBlitz: true,
            aicfRating: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('No player found with this KKDCA ID');
    }

    return user;
  }

  @Post('id-update-request')
  @ApiOperation({ summary: 'Submit ID update request' })
  async submitIdUpdateRequest(
    @Body() data: { kdcaId: string; tncaId?: string; aicfId?: string; fideId?: string },
  ) {
    if (!data.kdcaId) {
      throw new BadRequestException('KKDCA ID is required');
    }
    if (!data.tncaId && !data.aicfId && !data.fideId) {
      throw new BadRequestException('At least one ID (TNSCA, AICF, or FIDE) is required');
    }

    const user = await this.prisma.user.findFirst({
      where: { kdcaId: data.kdcaId.toUpperCase(), deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('No player found with this KKDCA ID');
    }

    // Check for existing pending request
    const existing = await this.prisma.idUpdateRequest.findFirst({
      where: { userId: user.id, status: 'PENDING' },
    });

    if (existing) {
      throw new BadRequestException('You already have a pending ID update request. Please wait for admin approval.');
    }

    const request = await this.prisma.idUpdateRequest.create({
      data: {
        userId: user.id,
        tncaId: data.tncaId || null,
        aicfId: data.aicfId || null,
        fideId: data.fideId || null,
      },
    });

    return {
      success: true,
      message: 'ID update request submitted successfully. Admin will review and approve shortly.',
      requestId: request.id,
    };
  }
}
