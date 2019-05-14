import {getUsers, getUserById} from "./resolvers/users";
import {getPosts, getPostById, createPost, deletePost} from "./resolvers/posts";

export default {
    getUsers,
    getUserById,
    getPosts,
    getPostById,
    createPost,
    deletePost
};