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
        folder: folder?.toString()
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
}
