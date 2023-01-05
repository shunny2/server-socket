import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IMessage {
    uid: string;
    text: string;
    createdAt: Date;
    user: Schema.Types.ObjectId;
}

export interface IMessageModel extends IMessage, Document { }

const MessageSchema = new Schema<IMessageModel>({
    uid: {
        type: String,
        default: uuidv4
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});

export const Message = model<IMessageModel>("Message", MessageSchema);