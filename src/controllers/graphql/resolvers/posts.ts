import PostModel, {Post} from "../../../data/Post";
import {converter as userConverter} from "./users";
import UserModel, {User} from "../../../data/User";

import {
    GraphPost,
    GraphMutationCreatePostArgs,
    GraphQueryGetPostByIdArgs
} from "../../../generated/graphql";

export function converter(model: Post, author: User): GraphPost {

    if (!model)
        return undefined;

    return {
        ...model,
        identifier: model._id,
        author: userConverter(author),
        created: model.created.toDateString()
    };
}

export async function getPosts(): Promise<GraphPost[]> {
    const posts = await PostModel.find({}).exec();
    const results = [];
    for (const post of posts) {
        const author = await UserModel.findById(post.author).exec();
        results.push(converter(post, author));
    }

    return results;
}

export async function getPostById(args: GraphQueryGetPostByIdArgs): Promise<GraphPost> {
    const post = await PostModel.findById(args.identifier).lean().exec();
    const author = await UserModel.findById(post.author).lean().exec();
    console.log(post, author);
    return converter(post, author);
}

export async function createPost(args: GraphMutationCreatePostArgs): Promise<GraphPost> {
    const post = await PostModel.create(args.input);
    const user = await UserModel.findById(post.author);
    return converter(post, user);
}