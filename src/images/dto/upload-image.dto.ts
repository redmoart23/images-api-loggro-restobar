import { IsString } from 'class-validator';

export class UploadImageDto {
  @IsString()
  uploadedBy: string;
}
