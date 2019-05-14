import {getUsers, getUser} from "./resolvers/users";
import {getBlogPosts, getBlogPost, createBlogPost} from "./resolvers/posts";

export default {
    getUsers,
    getUser,
    getBlogPosts,
    getBlogPost,
    createBlogPost
};