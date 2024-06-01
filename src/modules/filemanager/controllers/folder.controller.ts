import { injectable } from "tsyringe";
import { FolderService } from "../services";
import { Request, Response, NextFunction } from "express";
import { Res } from "../../../shared/helper";
import { StatusCodes } from "../../../shared/constants";

@injectable()
export default class FolderController {
  constructor(private folderService: FolderService) {}

  async move(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { object_id, to } = req.body;

      await this.folderService.move(object_id, to);

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully moved folder",
      });
    } catch (err: any) {
      next(err);
    }
  }

  async copy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { object_id, to } = req.body;

      await this.folderService.copy(object_id, to);

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully copied folder",
      });
    } catch (err: any) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, parent_folder_id } = req.body;

      const moveFolder = await this.folderService.createFolder({
        name,
        parent_folder_id,
      });

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully created folder",
        data: moveFolder,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const moveFolder = await this.folderService.deleteFolder({
        folder_id: id,
      });

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully deleted folder",
        data: moveFolder,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async rename(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, folder_id } = req.body;

      const moveFolder = await this.folderService.renameFolder({
        name,
        folder_id,
      });

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully renamed folder",
        data: moveFolder,
      });
    } catch (err: any) {
      next(err);
    }
  }
}
