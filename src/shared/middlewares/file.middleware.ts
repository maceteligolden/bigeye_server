import { S3Client } from "@aws-sdk/client-s3";
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new S3Client({
  region: `${process.env.AWS_S3_REGION}`,
});

const s3_storage = multerS3({
  s3: s3,
  bucket: `${process.env.AWS_S3_STORAGE_BUCKET}`,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req: any, file: any, cb: any) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req: any, file: any, cb: any) {
    cb(null, Date.now().toString());
  },
});

export const fileMiddleware = multer({
  storage: s3_storage,
});
