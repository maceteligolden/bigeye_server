import { injectable } from "tsyringe";
import { websocketSchema } from "../schemas";
import { Websocket } from "../entities";

interface IAddData {
    connectionId: string,
    userId?: string
}

@injectable()
export default class WebsocketRepository {
    constructor() {

    }

    async addData({ connectionId, userId}: IAddData): Promise<Websocket> {
        return await websocketSchema.create( {
            connectionId,
            userId
        });
    }

    async getConnectionId(userId: string): Promise<Websocket | null> {
        return await websocketSchema.findOne({
            userId
        });
    }

    async removeData(userId: string) {
        return websocketSchema.findOneAndDelete({userId})
    }

    async deleteAllDataByUserId(userId: string) {
        return await websocketSchema.deleteMany({
            userId
        })
    }

}