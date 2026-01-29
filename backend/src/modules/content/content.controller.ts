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
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ContentType, ContentStatus, UserRole } from '@prisma/client';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'List content (public)' })
  @ApiQuery({ name: 'type', required: false, enum: ContentType })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('type') type?: ContentType,
    @Query('showOnHome') showOnHome?: boolean,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.contentService.findAll({
      type,
      status: ContentStatus.PUBLISHED,
      showOnHome,
      page: page || 1,
      limit: Math.min(limit || 20, 50),
    });
  }

  @Get('homepage')
  @ApiOperation({ summary: 'Get homepage data (public)' })
  async getHomepageData() {
    return this.contentService.getHomepageData();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get content by slug (public)' })
  async findBySlug(@Param('slug') slug: string) {
    return this.contentService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create content (admin)' })
  async create(@CurrentUser('id') userId: string, @Body() data: any) {
    return this.contentService.create(data, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update content (admin)' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.contentService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete content (admin)' })
  async delete(@Param('id') id: string) {
    return this.contentService.delete(id);
  }
}
