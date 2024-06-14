import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { Res } from "../../../shared/helper";
import { StatusCodes } from "../../../shared/constants";
import { FileService } from "../services";
import { FileArray } from "express-fileupload";

@injectable()
export default class FileController {
  constructor(private fileService: FileService) {}

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const { files } = req;
      const { sub } = req.user;
      const { parent } = req.query;
      console.log("file: " + JSON.stringify(files));
      const response = await this.fileService.uploadFile({
        user_id: sub,
        parent: parent ? parent?.toString() : "",
        files: files as FileArray,
      });

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully uploaded file(s)",
        data: response,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async move(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { object_id, to } = req.body;

      await this.fileService.move(object_id, to);

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully moved file",
      });
    } catch (err: any) {
      next(err);
    }
  }

  async copy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { object_id, to } = req.body;

      await this.fileService.copy(object_id, to);

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully copied folder",
      });
    } catch (err: any) {
      next(err);
    }
  }
}
