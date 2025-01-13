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
    uploadImageDto: UploadImageDto,
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
          uploadedBy: uploadImageDto.uploadedBy,
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
}
