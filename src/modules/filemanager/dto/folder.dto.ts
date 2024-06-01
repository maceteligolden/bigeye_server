import { FileManager } from "../../../shared/entities";

export type CreateFolderInput = {
  name: string;
  parent_folder_id?: string | undefined;
};

export type CreateFolderOutput = {
  isFolderCreated: boolean;
};

export type DeleteFolderInput = {
  folder_id: string;
};

export type RenameFolderInput = {
  name: string;
  folder_id: string;
};

export type RenameFolderOutput = {
  data: FileManager;
};
