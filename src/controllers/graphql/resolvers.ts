import {getUsers, getUserById} from "./resolvers/users";
import {getPosts, getPostById, createPost, deletePost, likePost, unlikePost} from "./resolvers/posts";
import {getNearbyUsers, getUserPosition, updateOwnPosition} from "./resolvers/positions";

export default {
    getUsers,
    getUserById,

    getPosts,
    getPostById,
    createPost,
    deletePost,
    likePost,
    unlikePost,

    updateOwnPosition,
    getNearbyUsers,
    getUserPosition
};