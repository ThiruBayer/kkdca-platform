import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { MediaPurpose } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private uploadDir: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    entityType: string,
    entityId: string,
    purpose: MediaPurpose,
  ) {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'application/pdf',
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }

    const maxSize = this.configService.get<number>('MAX_FILE_SIZE', 5 * 1024 * 1024);
    if (file.size > maxSize) {
      throw new BadRequestException('File too large');
    }

    const ext = path.extname(file.originalname);
    const fileName = `${purpose.toLowerCase()}_${uuidv4()}${ext}`;
    const subDir = `${entityType}/${entityId}`;
    const fullDir = path.join(this.uploadDir, subDir);

    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }

    const filePath = path.join(fullDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const apiUrl = this.configService.get<string>('API_URL', 'http://localhost:3101');
    const fileUrl = `${apiUrl}/uploads/${subDir}/${fileName}`;

    const media = await this.prisma.media.create({
      data: {
        entityType,
        entityId,
        fileName,
        originalName: file.originalname,
        filePath: `${subDir}/${fileName}`,
        fileUrl,
        mimeType: file.mimetype,
        fileSize: file.size,
        purpose,
      },
    });

    return {
      id: media.id,
      fileName: media.fileName,
      fileUrl: media.fileUrl,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
    };
  }

  async deleteFile(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (media) {
      const fullPath = path.join(this.uploadDir, media.filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      await this.prisma.media.delete({
        where: { id },
      });
    }

    return { message: 'File deleted' };
  }

  async getEntityMedia(entityType: string, entityId: string) {
    return this.prisma.media.findMany({
      where: { entityType, entityId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
