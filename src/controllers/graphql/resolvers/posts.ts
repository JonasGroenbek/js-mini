import BlogPostModel, {BlogPost} from "../../../data/BlogPost";
import {converter as userConverter} from "./users";
import UserModel, {User} from "../../../data/User";

import {
    GraphBlogPost,
    GraphMutationCreatePostArgs,
    GraphQueryGetPostByIdArgs
} from "../../../generated/graphql";

export function converter(model: BlogPost, author: User): GraphBlogPost {

    if (!model)
        return undefined;

    return {
        ...model,
        identifier: model._id,
        author: userConverter(author),
        created: model.created.toDateString()
    };
}

export async function getPosts(): Promise<GraphBlogPost[]> {
    const posts = await BlogPostModel.find({}).exec();
    const results = [];
    for (const post of posts) {
        const author = await UserModel.findById(post.author).exec();
        results.push(converter(post, author));
    }

    return results;
}

export async function getPostById(args: GraphQueryGetPostByIdArgs): Promise<GraphBlogPost> {
    const post = await BlogPostModel.findById(args.identifier).lean().exec();
    const author = await UserModel.findById(post.author).lean().exec();
    return converter(post, author);
}

export async function createPost(args: GraphMutationCreatePostArgs): Promise<GraphBlogPost> {
    const post = await BlogPostModel.create(args.input);
    const user = await UserModel.findById(post.author);
    return converter(post, user);
}