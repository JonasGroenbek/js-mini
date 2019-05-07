import resolvers from "./resolvers";
import schema from "./schema";
import graphqlHttp from "express-graphql";

export default (options: {} = {}) => {
    const defaults = {rootValue: resolvers, schema};
    const newOptions = Object.assign(options, defaults);
    return graphqlHttp(newOptions);
};