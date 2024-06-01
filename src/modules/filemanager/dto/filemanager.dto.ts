import { FileManager } from "../../../shared/entities";

export type GetAllObjectsInput = {
  user_id: string;
  page: string;
  limit: string;
};

export type GetAllObjectsOutput = {
  data: FileManager[];
  current_page_number: string;
  page_count: string;
};

export type DeleteObjectInput = {
  object_id: string;
};

export type DeleteObjectOutput = {
  isObjectDeleted: boolean;
};
