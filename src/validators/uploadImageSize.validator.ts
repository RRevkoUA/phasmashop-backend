import { UnprocessableEntityException } from '@nestjs/common';

export const uploadImageSize = (req, file, cb) => {
  const fileSize = req.headers['content-length'];
  const maxFileSize = 1024 * 1024 * 2; // 2MB
  const minFileSize = 1024 * 45; // 45kB

  if (fileSize < minFileSize) {
    cb(new UnprocessableEntityException('File size is too small'), false);
    return false;
  } else if (fileSize > maxFileSize) {
    cb(new UnprocessableEntityException('File size is too large'), false);
    return false;
  }
  return true;
};
