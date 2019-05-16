import mongoose, {Schema, Document, Types} from "mongoose";
import {User} from "./User";
import ObjectId = Types.ObjectId;

export const PostSchema = new Schema({
    content: {type: String, required: true},
    title: {type: Schema.Types.String, required: true},
    images: [Schema.Types.String],
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    position: {type: [Schema.Types.Number], index: "2dsphere"},
    likedBy: [{type: Schema.Types.ObjectId, ref: "User"}],
    created: {type: Date, default: Date.now},
}, {collection: "blogposts"});

PostSchema.virtual("likedByCount", function () {
    return this.likedBy.length;
});

PostSchema.virtual("imagesCount", function () {
    return this.images.length;
});

export interface Post extends Document {
    title: string;
    content: string;
    images: string[];
    author: ObjectId;
    likedBy: ObjectId[];
    position: number[];
    created: Date;

    likedByCount(): number;
}

const Model = mongoose.model<Post>("Post", PostSchema);

export default Model;