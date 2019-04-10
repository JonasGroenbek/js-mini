import mongoose, {Schema, Document} from "mongoose";
import {User} from "./User";

const SECONDS = 1;
const EXPIRES = 60 * SECONDS;

export const PositionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    created: {type: Date, expires: EXPIRES, default: Date.now},
    location: {
        type: {type: String, enum: "Point", default: "Point"},
        coordinates: {type: [Number]}
    }
});

export interface Position extends Document {
    user: User;
    created: Date;
    location: { type: String, coordinates: [number] };
}

PositionSchema.index({loc: "2dsphere"}, {"background": true});

export default mongoose.model<Position>("Position", PositionSchema);
