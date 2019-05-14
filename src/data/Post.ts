import mongoose, {Schema, Document} from "mongoose";
import {User} from "./User";

export const PostSchema = new Schema({
    content: {type: String, required: true},
    title: {type: Schema.Types.String, required: true},
    images: [String],
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    position: {type: [Schema.Types.Number], index: "2dsphere"},
    likedBy: [{type: Schema.Types.ObjectId, ref: "User"}],
    created: {type: Date, default: Date.now},
}, {collection: "blogposts"});

PostSchema.virtual("likedByCount", function () {
    // @ts-ignore
    return this.likedBy.length;
});

export interface Post extends Document {
    title: string;
    content: string;
    images: string[];
    author: User;
    likedBy: [User];
    position: number[];
    created: Date;

    likedByCount(): number;
}

const Model = mongoose.model<Post>("Post", PostSchema);

export default Model;

export async function getPosts() {

    const results = await Model.aggregate([{
        $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author"
        }
    },
    ])
        .sort({created: -1})
        .exec();

    return results.map((post: any) => {
        post.author = post.author[0];
        return post;
    });
}