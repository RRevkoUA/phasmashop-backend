import { UnprocessableEntityException } from '@nestjs/common';

export const uploadImageSize = (
  req,
  file,
  cb,
  minFileKbSize,
  maxFileKbSize,
) => {
  const fileSize = req.headers['content-length'];
  const maxFileSize = 1024 * maxFileKbSize;
  const minFileSize = 1024 * minFileKbSize;

  if (fileSize < minFileSize) {
    cb(new UnprocessableEntityException('File size is too small'), false);
    return false;
  } else if (fileSize > maxFileSize) {
    cb(new UnprocessableEntityException('File size is too large'), false);
    return false;
  }
  return true;
};
