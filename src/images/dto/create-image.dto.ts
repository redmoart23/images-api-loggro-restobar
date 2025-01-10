import { IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  uploadedBy: string;

  @IsString()
  imageUrl: string;
}
