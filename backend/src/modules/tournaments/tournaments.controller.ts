import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TournamentsService } from './tournaments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TournamentStatus } from '@prisma/client';

@ApiTags('tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  @ApiOperation({ summary: 'List tournaments (public)' })
  @ApiQuery({ name: 'status', required: false, enum: TournamentStatus })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('status') status?: TournamentStatus,
    @Query('level') level?: string,
    @Query('organizationId') organizationId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.tournamentsService.findAll({
      status,
      level,
      organizationId,
      page: page || 1,
      limit: Math.min(limit || 20, 50),
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get tournament by slug (public)' })
  async findBySlug(@Param('slug') slug: string) {
    return this.tournamentsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create tournament' })
  async create(@CurrentUser('organizationId') orgId: string, @Body() data: any) {
    return this.tournamentsService.create(data, orgId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tournament' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.tournamentsService.update(id, data);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit tournament for approval' })
  async submitForApproval(@Param('id') id: string) {
    return this.tournamentsService.submitForApproval(id);
  }

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register for tournament' })
  async register(
    @Param('id') tournamentId: string,
    @CurrentUser('id') userId: string,
    @Body('category') category: string,
  ) {
    return this.tournamentsService.register(tournamentId, userId, category);
  }

  @Get(':id/registrations')
  @ApiOperation({ summary: 'Get tournament registrations' })
  async getRegistrations(
    @Param('id') tournamentId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.tournamentsService.getRegistrations(
      tournamentId,
      page || 1,
      Math.min(limit || 50, 100),
    );
  }

  @Post(':id/results')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tournament results' })
  async updateResults(@Param('id') id: string, @Body('results') results: any[]) {
    return this.tournamentsService.updateResults(id, results);
  }

  @Post(':id/publish-results')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish tournament results' })
  async publishResults(@Param('id') id: string) {
    return this.tournamentsService.publishResults(id);
  }
}
