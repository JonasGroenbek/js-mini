import {buildSchema} from "graphql";

export default buildSchema(`

input BlogPostPositionInput {
    longitude: Float!
    latitude: Float!
}

type BlogPostPosition {
    longitude: Float!
    latitude: Float!
}

input BlogPostInput {
    content: String!
    images: [String!]
    position: BlogPostPositionInput!
    author: ID!
}

type BlogPost {
    identifier: ID!
    content: String!
    images: [String!]!
    position: BlogPostPosition!
    author: User!
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
    getPosts: [BlogPost]
    getPostById(identifier: ID!): BlogPost
    getUsers: [User]
    getUserById(identifier: ID!): User
}

type Mutation {
    createPost(input: BlogPostInput!): BlogPost!
}
`);