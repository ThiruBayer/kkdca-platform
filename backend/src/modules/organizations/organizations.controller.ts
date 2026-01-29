import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, OrganizationType, OrganizationStatus } from '@prisma/client';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'List organizations (public)' })
  @ApiQuery({ name: 'type', required: false, enum: OrganizationType })
  @ApiQuery({ name: 'status', required: false, enum: OrganizationStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('type') type?: OrganizationType,
    @Query('status') status?: OrganizationStatus,
    @Query('talukId') talukId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.organizationsService.findAll({
      type,
      status: status || OrganizationStatus.APPROVED,
      talukId,
      page: page || 1,
      limit: Math.min(limit || 20, 50),
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get organization by slug (public)' })
  async findBySlug(@Param('slug') slug: string) {
    return this.organizationsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register new organization' })
  async create(@CurrentUser('id') userId: string, @Body() data: any) {
    return this.organizationsService.create(data, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organization' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.organizationsService.update(id, data);
  }

  // Office Bearers
  @Get(':id/office-bearers')
  @ApiOperation({ summary: 'Get organization office bearers' })
  async getOfficeBearers(@Param('id') orgId: string) {
    return this.organizationsService.getOfficeBearers(orgId);
  }

  @Post(':id/office-bearers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add office bearer' })
  async addOfficeBearer(@Param('id') orgId: string, @Body() data: any) {
    return this.organizationsService.addOfficeBearer(orgId, data);
  }

  @Patch(':id/office-bearers/:bearerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update office bearer' })
  async updateOfficeBearer(
    @Param('bearerId') bearerId: string,
    @Body() data: any,
  ) {
    return this.organizationsService.updateOfficeBearer(bearerId, data);
  }

  @Delete(':id/office-bearers/:bearerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove office bearer' })
  async removeOfficeBearer(@Param('bearerId') bearerId: string) {
    return this.organizationsService.removeOfficeBearer(bearerId);
  }
}
