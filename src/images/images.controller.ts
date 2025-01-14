import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImagesService } from './images.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { fileFilter } from './helpers/filefilter.helper';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadImageDto: UploadImageDto,
  ) {
    return await this.imagesService.uploadImage(uploadImageDto, file);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get('search')
  async findByDates(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const images = await this.imagesService.findByDates(startDate, endDate);
    return images;
  }

  @Get('stats')
  async getImageStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const stats = await this.imagesService.countImagesGroupedByDay(
      startDate,
      endDate,
    );
    return stats;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }
}
