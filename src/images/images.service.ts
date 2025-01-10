import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ImagesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ImagesService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('MongoDB connected successfully');
  }

  create(createImageDto: CreateImageDto) {
    return 'This action adds a new image' + createImageDto;
  }

  findAll() {
    return `This action returns all images`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
