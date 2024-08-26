import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { StatusCodes } from "../../../shared/constants";
import { Res } from "../../../shared/helper";
import { FileManagerService } from "../services";

@injectable()
export default class FileManagerController {
  constructor(private fileManagerService: FileManagerService) {}

  async getAllObjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, folder } = req.query;

      const { sub } = req.user;

      const response = await this.fileManagerService.getAllObjects({
        user_id: sub,
        page: page ? page.toString() : "1",
        limit: limit ? limit.toString() : "10",
        folder: folder?.toString(),
      });

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully fetched all objects",
        data: response,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteObject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const response = await this.fileManagerService.deleteObject({
        object_id: id,
      });

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully deleted all objects",
        data: response,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteManyObject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids } = req.body;

      await this.fileManagerService.deleteManyObjects({
        object_ids: ids,
      });

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully deleted all objects",
      });
    } catch (err: any) {
      next(err);
    }
  }

  async move(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids, to } = req.body;

      await this.fileManagerService.moveObjects(ids, to);

      Res({
        res,
        code: StatusCodes.NO_CONTENT,
        message: "successfully moved object",
      });
    } catch (err: any) {
      next(err);
    }
  }

  async copy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { object_ids, to } = req.body;

      await this.fileManagerService.copyObjects(object_ids, to);

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully copied folder",
      });
    } catch (err: any) {
      next(err);
    }
  }

  async rename(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub } = req.user;

      const { name, file_id } = req.body;

      await this.fileManagerService.rename({
        name,
        file_id,
        user_id: sub,
      });

      Res({
        res,
        code: StatusCodes.NO_CONTENT,
        message: "successfully renamed file",
      });
    } catch (err: any) {
      next(err);
    }
  }
}
