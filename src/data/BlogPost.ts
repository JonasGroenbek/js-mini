import mongoose, {Schema, Document} from "mongoose";
import {User} from "./User";

export const BlogPostSchema = new Schema({
    content: {type: String, required: true},
    title: {type: Schema.Types.String, required: true},
    images: [String],
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    position: {type: [Schema.Types.Number], index: "2dsphere"},
    likedBy: [{type: Schema.Types.ObjectId, ref: "User"}],
    created: {type: Date, default: Date.now},
    updated: Date
});

BlogPostSchema.virtual("likedByCount", function () {
    // @ts-ignore
    return this.likedBy.length;
});

export interface BlogPost extends Document {
    title: string;
    content: string;
    images: [string];
    author: User;
    likedBy: [User];
    position: { longitude: Number, latitude: Number };
    created: Date;
    updated: Date;

    likedByCount(): number;
}

const Model = mongoose.model<BlogPost>("BlogPost", BlogPostSchema);

export default Model;

export async function getBlogPosts() {

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