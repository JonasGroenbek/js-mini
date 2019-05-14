import PostModel, {Post} from "../../../data/Post";
import {converter as userConverter} from "./users";
import UserModel, {User} from "../../../data/User";
import authentication from "../authentication";
import {Request} from "express";

import {
    GraphPost,
    GraphMutationCreatePostArgs,
    GraphQueryGetPostByIdArgs, GraphMutationDeletePostArgs
} from "../../../generated/graphql";

export function converter(model: Post, author: User): GraphPost {

    if (!model)
        return undefined;

    return {
        ...model,
        identifier: model._id,
        position: {
            longitude: model.position[0],
            latitude: model.position[1]
        },
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
    if (!post)
        return undefined;

    const author = await UserModel.findById(post.author).lean().exec();
    return converter(post, author);
}

export async function createPost(args: GraphMutationCreatePostArgs, request: Request): Promise<GraphPost> {

    const authenticatedUser = await authentication(request);

    const toCreate = {
        ...args.input,
        author: authenticatedUser._id,
        position: [args.input.position.longitude, args.input.position.latitude]
    };

    const post = await PostModel.create(toCreate);
    const user = await UserModel.findById(post.author);
    return converter(post, user);
}

export async function deletePost(args: GraphMutationDeletePostArgs, request: Request): Promise<GraphPost> {

    const authenticatedUser = await authentication(request);
    const found = await PostModel.findById(args.identifier).lean().exec();

    if (!found)
        throw new Error("No post with the provided identifier exists.");

    if (found.author != authenticatedUser._id)
        throw new Error("You cannot delete posts belonging to other users.");

    return converter(await PostModel.findByIdAndDelete(args.identifier).lean().exec(), await UserModel.findById(authenticatedUser.id));
}