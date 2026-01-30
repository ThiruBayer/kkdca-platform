import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        taluk: true,
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
            slug: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.formatUserResponse(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByKdcaId(kdcaId: string) {
    const user = await this.prisma.user.findUnique({
      where: { kdcaId },
      include: {
        profile: true,
        taluk: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Player not found');
    }

    return this.formatPublicProfile(user);
  }

  async getProfile(userId: string) {
    return this.findById(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Build profile update data
    const profileUpdate: Record<string, any> = {};
    if (dto.addressLine1 !== undefined) profileUpdate.addressLine1 = dto.addressLine1;
    if (dto.addressLine2 !== undefined) profileUpdate.addressLine2 = dto.addressLine2;
    if (dto.city !== undefined) profileUpdate.city = dto.city;
    if (dto.district !== undefined) profileUpdate.district = dto.district;
    if (dto.state !== undefined) profileUpdate.state = dto.state;
    if (dto.pincode !== undefined) profileUpdate.pincode = dto.pincode;
    if (dto.bio !== undefined) profileUpdate.bio = dto.bio;
    if (dto.bloodGroup !== undefined) profileUpdate.bloodGroup = dto.bloodGroup;
    if (dto.fideId !== undefined) profileUpdate.fideId = dto.fideId;
    if (dto.aicfId !== undefined) profileUpdate.aicfId = dto.aicfId;
    if (dto.tncaId !== undefined) profileUpdate.tncaId = dto.tncaId;
    if (dto.occupation !== undefined) profileUpdate.occupation = dto.occupation;
    if (dto.schoolName !== undefined) profileUpdate.schoolName = dto.schoolName;
    if (dto.collegeName !== undefined) profileUpdate.collegeName = dto.collegeName;
    if (dto.guardianName !== undefined) profileUpdate.guardianName = dto.guardianName;
    if (dto.guardianPhone !== undefined) profileUpdate.guardianPhone = dto.guardianPhone;
    if (dto.guardianEmail !== undefined) profileUpdate.guardianEmail = dto.guardianEmail;
    if (dto.guardianRelation !== undefined) profileUpdate.guardianRelation = dto.guardianRelation;
    if (dto.dateOfBirth) profileUpdate.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.gender) profileUpdate.gender = dto.gender;

    // Determine profile operation
    let profileOp: any = undefined;
    if (user.profile && Object.keys(profileUpdate).length > 0) {
      profileOp = { update: profileUpdate };
    } else if (!user.profile && Object.keys(profileUpdate).length > 0) {
      profileOp = {
        create: {
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : new Date(),
          gender: (dto.gender as any) || 'MALE',
          ...profileUpdate,
        },
      };
    }

    // Update user basic info
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        displayName: dto.displayName,
        ...(dto.phone ? { phone: dto.phone } : {}),
        profile: profileOp,
      },
      include: {
        profile: true,
        taluk: true,
        organization: true,
      },
    });

    return this.formatUserResponse(updatedUser);
  }

  async searchPlayers(params: {
    query?: string;
    talukCode?: string;
    status?: UserStatus;
    page?: number;
    limit?: number;
  }) {
    const { query, talukCode, status, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      role: { in: [UserRole.PLAYER, UserRole.ARBITER] },
      status: status || UserStatus.ACTIVE,
      deletedAt: null,
    };

    if (query) {
      where.OR = [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { kdcaId: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (talukCode) {
      where.taluk = { code: talukCode };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: {
            select: {
              photoUrl: true,
              aicfRating: true,
              fideRatingStd: true,
            },
          },
          taluk: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user: any) => ({
        kdcaId: user.kdcaId,
        displayName: user.displayName || `${user.firstName} ${user.lastName || ''}`.trim(),
        photoUrl: user.profile?.photoUrl,
        taluk: user.taluk?.name,
        role: user.role,
        ratings: {
          aicf: user.profile?.aicfRating,
          fide: user.profile?.fideRatingStd,
        },
        memberSince: user.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async listArbiters(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where = {
      role: UserRole.ARBITER,
      status: UserStatus.ACTIVE,
      deletedAt: null,
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { firstName: 'asc' },
        include: {
          profile: {
            select: {
              photoUrl: true,
              arbiterGrade: true,
              arbiterCertNo: true,
            },
          },
          taluk: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user: any) => ({
        kdcaId: user.kdcaId,
        displayName: user.displayName || `${user.firstName} ${user.lastName || ''}`.trim(),
        photoUrl: user.profile?.photoUrl,
        taluk: user.taluk?.name,
        arbiterGrade: user.profile?.arbiterGrade,
        email: user.email,
        phone: user.phone,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async generateKdcaId(userId: string, talukCode: string) {
    const year = new Date().getFullYear();

    // Get the count of users in this taluk for this year
    const count = await this.prisma.user.count({
      where: {
        kdcaId: {
          endsWith: `${talukCode}${year}`,
        },
      },
    });

    const sequence = String(count + 1).padStart(3, '0');
    const kdcaId = `${sequence}${talukCode}${year}`;

    // Update user with KDCA ID
    await this.prisma.user.update({
      where: { id: userId },
      data: { kdcaId },
    });

    return kdcaId;
  }

  async activateMembership(userId: string) {
    const now = new Date();
    const year = now.getFullYear();
    const validFrom = new Date(year, 0, 1); // Jan 1
    const validTo = new Date(year, 11, 31, 23, 59, 59); // Dec 31

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { taluk: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate KDCA ID if not exists
    let kdcaId = user.kdcaId;
    if (!kdcaId && user.taluk) {
      kdcaId = await this.generateKdcaId(userId, user.taluk.code);
    }

    // Update membership
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.ACTIVE,
        membershipStatus: 'ACTIVE',
        membershipValidFrom: validFrom,
        membershipValidTo: validTo,
      },
    });

    return {
      kdcaId,
      membershipStatus: 'ACTIVE',
      validFrom,
      validTo,
    };
  }

  private formatUserResponse(user: any) {
    const { passwordHash, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      displayName:
        user.displayName || `${user.firstName} ${user.lastName || ''}`.trim(),
    };
  }

  private formatPublicProfile(user: any) {
    return {
      kdcaId: user.kdcaId,
      displayName:
        user.displayName || `${user.firstName} ${user.lastName || ''}`.trim(),
      photoUrl: user.profile?.photoUrl,
      taluk: user.taluk?.name,
      memberSince: user.createdAt,
      role: user.role,
      ratings: {
        fide: user.profile?.fideRatingStd,
        aicf: user.profile?.aicfRating,
      },
      achievements: user.profile?.achievements || [],
    };
  }
}
