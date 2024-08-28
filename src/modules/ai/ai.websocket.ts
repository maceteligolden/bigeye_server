import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { WebsocketRepository } from "../../shared/repositories";
import { Res } from "../../shared/helper";
import { StatusCodes } from "../../shared/constants";
import AIService from "./ai.service";

@injectable()
export default class AIWebsocket {
    constructor(
        private websocketRepository: WebsocketRepository,
        private aiService: AIService
    ){

    }

    async connect(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { connectionId, userId } = req.body;

            if(userId) {
                await this.websocketRepository.addData({connectionId, userId});
            } 

            if(userId) {
                const user = await this.websocketRepository.getConnectionId(userId);

                if(user){
                    await this.websocketRepository.removeData(userId);
                }
                await this.websocketRepository.addData({connectionId, userId})
            }
            
           Res({
                res,
                code: StatusCodes.OK,
                message: "websocket successfully connected"
           });
        }catch(err){
            Res({
                res,
                code: StatusCodes.INTERNAL_SERVER,
                message: "failed to connect to websocket"
           });
        }
    }

    async disconnect(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            Res({
                res,
                code: StatusCodes.OK,
                message: "disconnect from websocket"
           });
        }catch(err){
            Res({
                res,
                code: StatusCodes.INTERNAL_SERVER,
                message: "failed to disconnect to websocket"
           });
        }
    }

    async send(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { payload } = req.body;

            const { from, chat_id, message } = payload;

            await this.aiService.sendPrompt({
                message,
                chat_id,
                from
            });
         
            Res({
                res,
                code: StatusCodes.OK,
                message: "disconnect from websocket"
           });
        }catch(err){
            Res({
                res,
                code: StatusCodes.INTERNAL_SERVER,
                message: "failed to disconnect to websocket"
           });
        }
    }

}