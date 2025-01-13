import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callback: Function,
) => {
  if (!file)
    return callback(new BadRequestException('Property file is missing'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }
  callback(
    new UnsupportedMediaTypeException(
      `File format ${fileExtension} is not allowed`,
    ),
    false,
  );
};
