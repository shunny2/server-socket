import { Document, Schema, model } from "mongoose";

export interface IUser {
    uuid: string;
    name: string;
    socketId: string;
}

export interface IUserModel extends IUser, Document {
    findByName: (name: string) => Promise<IUser>;
}

const UserSchema = new Schema<IUserModel>({
    uuid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true,
    }
});

export const User = model<IUserModel>("User", UserSchema);