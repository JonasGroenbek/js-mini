import BlogPostModel from "../../../data/BlogPost";
import UserModel from "../../../data/User";

export async function getBlogPosts() {
    return await BlogPostModel.find().exec();
}

export async function getBlogPost(args: { id: string }) {
    const result =  await BlogPostModel.findById(args.id).exec();
    result.author = await UserModel.findById(result.author).exec();
    return result;
}

export async function createBlogPost(args: { input: {} }) {
    return await BlogPostModel.create(args.input);
}