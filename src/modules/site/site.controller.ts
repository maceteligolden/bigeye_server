import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import SiteService from "./site.service";
import { Res } from "../../shared/helper";
import { StatusCodes } from "../../shared/constants";

@injectable()
export default class SiteController {
    constructor(
        private siteService: SiteService
    ){

    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          
            const { sub } = req.user;

            const { name, healthcheck_link } = req.body;

            const response = await this.siteService.create({
                name, 
                healthcheck_link,
                user_id: sub
            });
    
          Res({
            res,
            code: StatusCodes.CREATED,
            message: "successfully created site",
            data: response,
          });
        } catch (err: any) {
          next(err);
        }
    }

    async fetchAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          
            const { sub } = req.user;

            const response = await this.siteService.fetchAll(sub);
    
            Res({
            res,
            code: StatusCodes.OK,
            message: "successfully fetched all sites",
            data: response,
            });
        } catch (err: any) {
          next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { site_id } = req.params;

            await this.siteService.delete(site_id);
    
            Res({
            res,
            code: StatusCodes.NO_CONTENT,
            message: "successfully deleted site"
            });
        } catch (err: any) {
          next(err);
        }
    }
}