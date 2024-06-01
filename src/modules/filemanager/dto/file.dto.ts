import { FileArray } from "express-fileupload";

export type UploadFileInput = {
  files: FileArray;
  user_id: string;
  parent: string;
};

export type UploadFileOutput = {
  isUploaded: boolean;
};
