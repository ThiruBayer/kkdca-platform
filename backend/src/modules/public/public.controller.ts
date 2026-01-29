import { Controller, Get, Post, Body } from '@nestjs/common';
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

    return settings.reduce((acc, setting) => {
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
    // In production, send email notification
    // For now, just acknowledge receipt
    return {
      success: true,
      message: 'Your message has been received. We will get back to you soon.',
    };
  }
}
