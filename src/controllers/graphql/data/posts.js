import BlogPostModel from "../../../data/BlogPost";
import UserModel from "../../../data/User";

export default class Repository {

    async getAll() {

    }

    async getById(id) {
        const result = await BlogPostModel.findById(args.id).exec();
        result.author = await UserModel.findById(result.author).exec();
        return result;
    }
}