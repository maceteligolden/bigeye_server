import { FileArray } from "express-fileupload";
import { FileManager } from "../../../shared/entities";

export type UploadFileInput = {
  files: FileArray;
  user_id: string;
  parent: string;
};

export type UploadFileOutput = {
  isUploaded: boolean;
};

export type RenameFileInput = {
  name: string;
  file_id: string;
  user_id: string;
};

export type RenameFileOutput = {
  data: FileManager;
};
