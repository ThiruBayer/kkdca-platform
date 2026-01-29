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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, UserStatus } from '@prisma/client';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard data' })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllUsers(
    @Query('role') role?: UserRole,
    @Query('status') status?: UserStatus,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAllUsers({
      role,
      status,
      search,
      page: page || 1,
      limit: Math.min(limit || 20, 100),
    });
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status' })
  async updateUserStatus(
    @Param('id') userId: string,
    @Body('status') status: UserStatus,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.updateUserStatus(userId, status, reason);
  }

  @Post('users/:id/approve-arbiter')
  @ApiOperation({ summary: 'Approve arbiter application' })
  async approveArbiter(@Param('id') userId: string) {
    return this.adminService.approveArbiter(userId);
  }

  @Post('organizations/:id/approve')
  @ApiOperation({ summary: 'Approve organization' })
  async approveOrganization(
    @Param('id') orgId: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.approveOrganization(orgId, adminId);
  }

  @Post('organizations/:id/reject')
  @ApiOperation({ summary: 'Reject organization' })
  async rejectOrganization(
    @Param('id') orgId: string,
    @Body('reason') reason: string,
  ) {
    return this.adminService.rejectOrganization(orgId, reason);
  }

  @Post('tournaments/:id/approve')
  @ApiOperation({ summary: 'Approve tournament' })
  async approveTournament(
    @Param('id') tournamentId: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.approveTournament(tournamentId, adminId);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get all settings' })
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings/:key')
  @ApiOperation({ summary: 'Update a setting' })
  async updateSetting(
    @Param('key') key: string,
    @Body('value') value: any,
  ) {
    return this.adminService.updateSetting(key, value);
  }

  @Get('reports/payments')
  @ApiOperation({ summary: 'Get payment reports' })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  async getPaymentReports(@Query('from') from: string, @Query('to') to: string) {
    return this.adminService.getPaymentReports(new Date(from), new Date(to));
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAuditLogs(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAuditLogs({
      userId,
      action,
      page: page || 1,
      limit: Math.min(limit || 50, 100),
    });
  }
}
