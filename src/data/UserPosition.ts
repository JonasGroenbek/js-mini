import mongoose, {Schema, Document, Types} from "mongoose";
import {User} from "./User";
import ObjectId = Types.ObjectId;

const SECONDS = 1;
const EXPIRES = 60 * SECONDS;

export const UserPositionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    created: {type: Date, expires: EXPIRES, default: Date.now},
    position: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Schema.Types.Number]
        }
    }
});

export interface UserPosition extends Document {
    user: ObjectId;
    created: Date;
    position: {
        type: string,
        coordinates: [number, number]
    };
}

export default mongoose.model<UserPosition>("UserPosition", UserPositionSchema);
