import {Post} from "../../data/Post";
import {GraphPost, GraphPostInput} from "./graphql";
import {Types} from "mongoose";
import UserModel, {User} from "../../data/User";
import PostModel from "../../data/Post";
import UserFacade from "./UserFacade";

export default class PostFacade {

    static async getPosts() {
        return this.convertMany(await PostModel.find({}).lean().exec());
    }

    static async getPostById(id: string) {
        const post = await PostModel.findById(id).lean().exec();
        if (!post)
            return undefined;

        return this.convertOne(post);
    }

    static async likePost(post: string, actor: string) {
        const pull = await PostModel.findOneAndUpdate({_id: post}, {$pull: {likedBy: actor}}, {new: true}).exec();
        const push = await PostModel.findOneAndUpdate({_id: post}, {$push: {likedBy: actor}}, {new: true}).exec();

        if (!pull || !push)
            throw new Error("No post with the provided identifier exists.");

        return this.convertOne(push);
    }

    static async unlikePost(post: string, actor: string) {
        const found = await PostModel.findOneAndUpdate({_id: post}, {$pull: {likedBy: actor}}, {new: true}).exec();
        if (!found)
            throw new Error("No post with the provided identifier exists.");

        return this.convertOne(found);
    }

    static async deletePost(id: string) {
        return PostModel.findByIdAndDelete(id).lean().exec();
    }

    static async createPost(information: GraphPostInput, author: string): Promise<GraphPost> {
        const toCreate = {
            ...information,
            author,
            position: [information.position.longitude, information.position.latitude]
        };

        return PostFacade.convertOne(await PostModel.create(toCreate));
    }

    static async convertOne(post: Post): Promise<GraphPost> {
        if (!post)
            return undefined;

        return (await this.convertMany([post]))[0];
    }

    static async convertMany(posts: Post[]): Promise<GraphPost[]> {

        if (posts.length < 1)
            return [];

        const usersToRetrieve = posts.reduce((acc, post) => {
            acc.add(post.author);
            post.likedBy.forEach(v => acc.add(v));
            return acc;
        }, new Set<Types.ObjectId>());

        const retrievedUsers = (await UserModel.find({
            _id: {
                $in: Array.from(usersToRetrieve)
            }
        }).lean().exec()).reduce((acc: { [key: string]: User }, u: User) => {
            acc[u._id.toHexString()] = u;
            return acc;
        }, {});

        const results = [];
        for (const post of posts) {

            const likedBy = [];
            for (const like of post.likedBy)
                likedBy.push(await UserFacade.convertOne(retrievedUsers[like.toHexString()]));

            results.push({
                ...post,
                identifier: post._id,
                position: {
                    longitude: post.position[0],
                    latitude: post.position[1]
                },
                likedBy,
                author: await UserFacade.convertOne(retrievedUsers[post.author.toHexString()]),
                created: post.created.toDateString()
            });
        }

        return results;
    }
}