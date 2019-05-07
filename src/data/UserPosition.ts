import mongoose, {Schema, Document} from "mongoose";
import {User} from "./User";

const SECONDS = 1;
const EXPIRES = 60 * SECONDS;

export const UserPositionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    created: {type: Date, expires: EXPIRES, default: Date.now},
    location: {
        type: {type: String, enum: "Point", default: "Point"},
        coordinates: {type: [Number]}
    }
});

export interface UserPosition extends Document {
    user: User;
    created: Date;
    location: { type: String, coordinates: [number] };
}

UserPositionSchema.index({loc: "2dsphere"}, {"background": true});

export default mongoose.model<UserPosition>("UserPosition", UserPositionSchema);
