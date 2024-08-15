import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { CodeService } from "../services";
import { Res } from "../../../shared/helper";
import { StatusCodes } from "../../../shared/constants";

@injectable()
export default class CodeController {
    constructor(
        private codeService: CodeService
    ){

    }

    async getCodes(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const response = await this.codeService.getAllCodes();
    
          Res({
            res,
            message: "successfully fetched all codes",
            code: StatusCodes.OK,
            data: response,
          });
        } catch (err: any) {
          next(err);
        }
    }

    async getCode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { id } = req.params;
          const response = await this.codeService.fetchCode(Number(id));
    
          Res({
            res,
            message: "successfully fetched all code",
            code: StatusCodes.OK,
            data: response,
          });
        } catch (err: any) {
          next(err);
        }
    }

    async download(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
        
          const { sub } = req.user;
          const { key, folder_id } = req.body;
          const response = await this.codeService.download(key, sub, folder_id);
    
          Res({
            res,
            message: "successfully downloaded code to filemanager",
            code: StatusCodes.OK,
            data: response,
          });
        } catch (err: any) {
          next(err);
        }
    }
}