import authentication from "../authentication";
import PostFacade from "../../facades/PostFacade";
import {Request} from "express";
import {
    GraphPost,
    GraphMutationCreatePostArgs,
    GraphQueryGetPostByIdArgs,
    GraphMutationDeletePostArgs,
    GraphMutationLikePostArgs, GraphQueryGetPostImagesArgs
} from "../../facades/graphql";

export async function getPosts(): Promise<GraphPost[]> {
    return PostFacade.getPosts();
}

export async function getPostImages(args: GraphQueryGetPostImagesArgs) {
    const post = await PostFacade.getPostById(args.post);
    if (!post)
        return undefined;

    return post.images;
}

export async function getPostById(args: GraphQueryGetPostByIdArgs) {
    return PostFacade.getPostById(args.identifier);
}

export async function createPost(args: GraphMutationCreatePostArgs, request: Request) {

    const authenticatedUser = await authentication(request);

    return PostFacade.createPost(args.input, authenticatedUser._id);
}

export async function deletePost(args: GraphMutationDeletePostArgs, request: Request) {

    const authenticatedUser = await authentication(request);
    const found = await PostFacade.getPostById(args.post);

    if (!found)
        throw new Error("No post with the provided identifier exists.");

    if (found.author != authenticatedUser._id)
        throw new Error("You cannot delete posts belonging to other users.");

    return PostFacade.deletePost(args.post);
}

export async function likePost(args: GraphMutationLikePostArgs, request: Request) {

    const authenticatedUser = await authentication(request);

    return PostFacade.likePost(args.post, authenticatedUser._id);
}

export async function unlikePost(args: GraphMutationLikePostArgs, request: Request) {

    const authenticatedUser = await authentication(request);

    return PostFacade.unlikePost(args.post, authenticatedUser._id);
}