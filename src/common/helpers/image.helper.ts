import { diskStorage } from 'multer';
import { uploadImageSize, uploadImageType } from 'src/common/validators';
import { v4 as uuidv4 } from 'uuid';

const createStorage = (path) =>
  diskStorage({
    destination: `${process.cwd()}/images/${path}`,
    filename: (req, file, cb) => {
      const extension = file.originalname.split('.').pop();
      const filename = `${uuidv4()}.${extension}`;
      cb(null, filename);
    },
  });

const createFileFilter = (minFileKbSize, maxFileKbSize) => (req, file, cb) => {
  if (
    uploadImageType(req, file, cb) &&
    uploadImageSize(req, file, cb, minFileKbSize, maxFileKbSize)
  ) {
    cb(null, true);
  }
};

export const imageHelper = {
  avatar: {
    storage: createStorage('avatars'),
    fileFilter: createFileFilter(10, 1024 * 10),
    limits: { files: 1 },
  },
  commentary: {
    storage: createStorage('commentaries'),
    fileFilter: createFileFilter(10, 1024 * 5),
    limits: { files: 5 },
  },
  product: {
    storage: createStorage('products'),
    fileFilter: createFileFilter(10, 1024 * 10),
    limits: { files: 10 },
  },
};
