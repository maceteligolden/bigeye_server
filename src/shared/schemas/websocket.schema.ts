import { Schema, model } from "mongoose";
import { Websocket } from "../entities";

const websocketSchema = new Schema<Websocket>({
  connectionId: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model("Websocket", websocketSchema);
