import BlogPostModel, {BlogPost} from "../../../data/BlogPost";
import UserModel from "../../../data/User";
import {getBlogPosts as retrieveBlogPosts} from "../../../data/BlogPost";

export async function getBlogPosts() {
    return (await retrieveBlogPosts()).map(converter);
}

export async function getBlogPost(args: { id: string }) {
    const result = await BlogPostModel.findById(args.id).exec();
    result.author = await UserModel.findById(result.author).exec();
    return result;
}

export async function createBlogPost(args: { input: {} }) {
    return await BlogPostModel.create(args.input);
}

function converter(post: BlogPost) {
    post.position = {
        // @ts-ignore
        longitude: post.position[0],
        // @ts-ignore
        latitude: post.position[1]
    };
}