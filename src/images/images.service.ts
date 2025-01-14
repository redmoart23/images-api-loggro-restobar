import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

import * as sharp from 'sharp';
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { UploadImageDto } from './dto/upload-image.dto';
import { envs } from 'src/config/envs';
import { UploadedImageResponse } from './interfaces/uploaded-image-response.interface';

@Injectable()
export class ImagesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ImagesService');

  // Aws S3 client config
  private readonly s3 = new S3Client({
    region: envs.awsRegion,
    credentials: {
      accessKeyId: envs.awsAccessKeyId,
      secretAccessKey: envs.awsSecretAccessKey,
    },
  });

  // Database connection
  async onModuleInit() {
    await this.$connect();
    this.logger.log('MongoDB connected successfully');
  }

  async uploadImage(
    { uploadedBy }: UploadImageDto,
    file: Express.Multer.File,
  ): Promise<UploadedImageResponse> {
    const fileKey = `${Date.now()}.png`;

    const pngBuffer = await sharp(file.buffer).png().toBuffer();

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: envs.awsS3BucketName,
          Key: fileKey,
          Body: pngBuffer,
          ContentType: 'image/png',
          ACL: 'public-read',
        }),
      );

      const imageUrl = `https://${envs.awsS3BucketName}.s3.${envs.awsRegion}.amazonaws.com/${fileKey}`;

      const image = await this.image.create({
        data: {
          uploadedBy: uploadedBy,
          imageUrl: imageUrl,
        },
      });
      return image;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to upload image, please try again',
        error,
      );
    }
  }

  async findAll() {
    return await this.image.findMany();
  }

  async findOne(id: string) {
    try {
      return await this.image.findUnique({ where: { id: id } });
    } catch (error) {
      throw new NotFoundException('Image not found or invalid id', error);
    }
  }

  async findByDates(startDate: string, endDate: string) {
    return await this.image.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate + 'T00:00:00.000Z'),
          lte: new Date(endDate + 'T23:59:59.999Z'),
        },
      },
    });
  }

  async remove(id: string) {
    try {
      return await this.image.delete({ where: { id: id } });
    } catch (error) {
      throw new NotFoundException(
        'Unable to delete, Image not found or invalid id',
        error,
      );
    }
  }

  async countImagesGroupedByDay(startDate: string, endDate: string) {
    const results = await this.image.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: new Date(startDate + 'T00:00:00.000Z'),
          lte: new Date(endDate + 'T23:59:59.999Z'),
        },
      },
    });

    const dailyCounts = new Map<string, number>();

    results.forEach((entry) => {
      const dateKey = entry.createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      });

      dailyCounts.set(
        dateKey,
        (dailyCounts.get(dateKey) || 0) + entry._count.id,
      );
    });

    return Array.from(dailyCounts.entries()).map(([date, count]) => ({
      date,
      totalImagesUploaded: count,
      imagesPerHour: parseFloat((count / 24).toFixed(2)),
    }));
  }
}
