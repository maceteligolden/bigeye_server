import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { Res } from "../../shared/helper";
import { StatusCodes } from "../../shared/constants";
import ChatService from "./chat.service";

@injectable()
export default class ChatController {
  constructor(private chatService: ChatService) {}

  async createChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title } = req.body;

      const { sub } = req.user;

      await this.chatService.createChat(title, sub);

      Res({
        res,
        message: "successfully created chat",
        code: StatusCodes.CREATED,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getChats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { sub } = req.user;

      const data = await this.chatService.getChats(sub);

      Res({
        res,
        message: "successfully fetched chats",
        code: StatusCodes.OK,
        data
      });
    } catch (err: any) {
      next(err);
    }
  }

  async rename(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { chat_id } = req.params;

      const { title } = req.body;

      await this.chatService.renameChat(chat_id, title);

      Res({
        res,
        message: "successfully renamed chat",
        code: StatusCodes.NO_CONTENT
      });
    } catch (err: any) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { chat_id } = req.params;

      await this.chatService.deleteChat(chat_id);

      Res({
        res,
        message: "successfully deleted chat",
        code: StatusCodes.NO_CONTENT
      });
    } catch (err: any) {
      next(err);
    }
  }
}
