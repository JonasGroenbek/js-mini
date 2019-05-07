import {getUsers, getUser} from "./resolvers/users";
import {getBlogPosts, getBlogPost, createBlogPost} from "./resolvers/blogPosts";

export default {
    getUsers,
    getUser,
    getBlogPosts,
    getBlogPost,
    createBlogPost
};