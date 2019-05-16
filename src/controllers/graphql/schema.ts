import {buildSchema} from "graphql";

export default buildSchema(`

input PostPositionInput {
    longitude: Float!
    latitude: Float!
}

type PostPosition {
    longitude: Float!
    latitude: Float!
}

input PostInput {
    title: String!
    content: String!
    images: [String!]
    position: PostPositionInput!
}

type Post {
    identifier: ID!
    title: String!
    content: String!
    images: [String!]!
    imagesCount: Int!
    position: PostPosition!
    author: User!
    likedBy: [User!]!
    likedByCount: Int!
    created: String!
}

input UserPositionInput {
    latitude: Float!
    longitude: Float!
}

type UserPosition {
    user: User!
    latitude: Float!
    longitude: Float!
    timestamp: String!
}

input UserInput {
    firstName: String!,
    lastName: String!
    email: String!
    password: String!
}

type User {
    identifier: ID!
    firstName: String!,
    lastName: String!
    email: String!
}

type Query {
    getPosts: [Post]
    getPostImages(post: ID!): [String!]
    getPostById(identifier: ID!): Post
    getUsers: [User]
    getUserById(identifier: ID!): User
    getUserPosition(user: ID!): UserPosition
    getNearbyUsers(radiusMeters: Int!): [UserPosition!]!
}

type Mutation {
    createPost(input: PostInput!): Post!
    deletePost(post: ID!): Post
    likePost(post: ID!): Post
    unlikePost(post: ID!): Post

    updateOwnPosition(longitude: Float!, latitude: Float!): UserPosition!
}
`);