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
    content: String!
    images: [String!]!
    position: PostPosition!
    author: User!
    likedBy: [User!]!
    created: String!
}

input UserPositionInput {
    user: ID!
    location: [Int!]!
}

type UserPosition {
    identifier: ID!
    user: User!
    location: [Int!]!
    created: String!
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
    getPostById(identifier: ID!): Post
    getUsers: [User]
    getUserById(identifier: ID!): User
}

type Mutation {
    createPost(input: PostInput!): Post!
    deletePost(post: ID!): Post
    likePost(post: ID!): Post
    unlikePost(post: ID!): Post
}
`);