import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserStatus } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get('players/search')
  @ApiOperation({ summary: 'Search players (public)' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({ name: 'taluk', required: false, description: 'Taluk code filter' })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchPlayers(
    @Query('q') query?: string,
    @Query('taluk') talukCode?: string,
    @Query('status') status?: UserStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.searchPlayers({
      query,
      talukCode,
      status,
      page: page || 1,
      limit: Math.min(limit || 20, 50),
    });
  }

  @Get('players/:kdcaId')
  @ApiOperation({ summary: 'Get player public profile by KDCA ID' })
  async getPlayerByKdcaId(@Param('kdcaId') kdcaId: string) {
    return this.usersService.findByKdcaId(kdcaId);
  }

  @Get('arbiters')
  @ApiOperation({ summary: 'List all arbiters (public)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async listArbiters(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.listArbiters(page || 1, Math.min(limit || 20, 50));
  }
}
