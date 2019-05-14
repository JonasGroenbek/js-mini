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
    _id: ID!
    content: String!
    images: [String!]!
    position: BlogPostPosition!
    author: User!
    created: String!
    updated: String!
}

input UserPositionInput {
    user: ID!
    location: [Int!]!
}

type UserPosition {
    _id: ID!
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
    _id: ID!
    firstName: String!,
    lastName: String!
    email: String!
}

type Query {
    getBlogPosts: [BlogPost]
    getBlogPost(id: ID!): BlogPost
    getUsers: [User]
    getUser(id: ID!): User
}

type Mutation {
    createBlogPost(input: BlogPostInput!): BlogPost!
}
`);