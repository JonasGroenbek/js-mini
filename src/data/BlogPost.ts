import mongoose, {Schema, Document} from "mongoose";
import {User} from "./User";

export const BlogPostSchema = new Schema({
    information: {type: String, required: true},
    images: [String],
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    likedBy: [{type: Schema.Types.ObjectId, ref: "User"}],
    position: {
        longitude: {type: Number, required: true},
        latitude: {type: Schema.Types.Number, required: true}
    },
    created: {type: Date, default: Date.now},
    updated: Date
});

BlogPostSchema.virtual("likedByCount", function () {
    // @ts-ignore
    return this.likedBy.length;
});

export interface BlogPost extends Document {
    information: string;
    images: [string];
    author: User;
    likedBy: [User];
    position: { longitude: Number, latitude: Number };
    created: Date;
    updated: Date;

    likedByCount(): number;
}

export default mongoose.model<BlogPost>("BlogPost", BlogPostSchema);