import {getUsers, getUserById} from "./resolvers/users";
import {getPosts, getPostById, createPost, deletePost, likePost, unlikePost} from "./resolvers/posts";

export default {
    getUsers,
    getUserById,
    getPosts,
    getPostById,
    createPost,
    deletePost,
    likePost,
    unlikePost
};