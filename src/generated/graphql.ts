export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GraphAdditionalEntityFields = {
  path?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
};

export type GraphPost = {
  identifier: Scalars["ID"];
  content: Scalars["String"];
  images: Array<Scalars["String"]>;
  position: GraphPostPosition;
  author: GraphUser;
  created: Scalars["String"];
};

export type GraphPostInput = {
  content: Scalars["String"];
  images?: Maybe<Array<Scalars["String"]>>;
  position: GraphPostPositionInput;
  author: Scalars["ID"];
};

export type GraphPostPosition = {
  longitude: Scalars["Float"];
  latitude: Scalars["Float"];
};

export type GraphPostPositionInput = {
  longitude: Scalars["Float"];
  latitude: Scalars["Float"];
};

export type GraphMutation = {
  createPost: GraphPost;
};

export type GraphMutationCreatePostArgs = {
  input: GraphPostInput;
};

export type GraphQuery = {
  getPosts?: Maybe<Array<Maybe<GraphPost>>>;
  getPostById?: Maybe<GraphPost>;
  getUsers?: Maybe<Array<Maybe<GraphUser>>>;
  getUserById?: Maybe<GraphUser>;
};

export type GraphQueryGetPostByIdArgs = {
  identifier: Scalars["ID"];
};

export type GraphQueryGetUserByIdArgs = {
  identifier: Scalars["ID"];
};

export type GraphUser = {
  identifier: Scalars["ID"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  email: Scalars["String"];
};

export type GraphUserInput = {
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
};

export type GraphUserPosition = {
  identifier: Scalars["ID"];
  user: GraphUser;
  location: Array<Scalars["Int"]>;
  created: Scalars["String"];
};

export type GraphUserPositionInput = {
  user: Scalars["ID"];
  location: Array<Scalars["Int"]>;
};

import { GraphQLResolveInfo } from "graphql";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GraphResolversTypes = {
  Query: {};
  Post: GraphPost;
  ID: Scalars["ID"];
  String: Scalars["String"];
  PostPosition: GraphPostPosition;
  Float: Scalars["Float"];
  User: GraphUser;
  Mutation: {};
  PostInput: GraphPostInput;
  PostPositionInput: GraphPostPositionInput;
  Boolean: Scalars["Boolean"];
  UserInput: GraphUserInput;
  UserPosition: GraphUserPosition;
  Int: Scalars["Int"];
  UserPositionInput: GraphUserPositionInput;
  AdditionalEntityFields: GraphAdditionalEntityFields;
};

export type GraphUnionDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = {
    discriminatorField?: Maybe<Maybe<Scalars["String"]>>;
    additionalFields?: Maybe<Maybe<Array<Maybe<GraphAdditionalEntityFields>>>>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GraphAbstractEntityDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = {
    discriminatorField?: Maybe<Scalars["String"]>;
    additionalFields?: Maybe<Maybe<Array<Maybe<GraphAdditionalEntityFields>>>>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GraphEntityDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = {
    embedded?: Maybe<Maybe<Scalars["Boolean"]>>;
    additionalFields?: Maybe<Maybe<Array<Maybe<GraphAdditionalEntityFields>>>>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GraphColumnDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = { overrideType?: Maybe<Maybe<Scalars["String"]>> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GraphIdDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = {}
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GraphLinkDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = { overrideType?: Maybe<Maybe<Scalars["String"]>> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GraphEmbeddedDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = {}
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GraphMapDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = { path?: Maybe<Scalars["String"]> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GraphPostResolvers<
  ContextType = any,
  ParentType = GraphResolversTypes["Post"]
> = {
  identifier?: Resolver<GraphResolversTypes["ID"], ParentType, ContextType>;
  content?: Resolver<GraphResolversTypes["String"], ParentType, ContextType>;
  images?: Resolver<
    Array<GraphResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  position?: Resolver<
    GraphResolversTypes["PostPosition"],
    ParentType,
    ContextType
  >;
  author?: Resolver<GraphResolversTypes["User"], ParentType, ContextType>;
  created?: Resolver<GraphResolversTypes["String"], ParentType, ContextType>;
};

export type GraphPostPositionResolvers<
  ContextType = any,
  ParentType = GraphResolversTypes["PostPosition"]
> = {
  longitude?: Resolver<GraphResolversTypes["Float"], ParentType, ContextType>;
  latitude?: Resolver<GraphResolversTypes["Float"], ParentType, ContextType>;
};

export type GraphMutationResolvers<
  ContextType = any,
  ParentType = GraphResolversTypes["Mutation"]
> = {
  createPost?: Resolver<
    GraphResolversTypes["Post"],
    ParentType,
    ContextType,
    GraphMutationCreatePostArgs
  >;
};

export type GraphQueryResolvers<
  ContextType = any,
  ParentType = GraphResolversTypes["Query"]
> = {
  getPosts?: Resolver<
    Maybe<Array<Maybe<GraphResolversTypes["Post"]>>>,
    ParentType,
    ContextType
  >;
  getPostById?: Resolver<
    Maybe<GraphResolversTypes["Post"]>,
    ParentType,
    ContextType,
    GraphQueryGetPostByIdArgs
  >;
  getUsers?: Resolver<
    Maybe<Array<Maybe<GraphResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
  getUserById?: Resolver<
    Maybe<GraphResolversTypes["User"]>,
    ParentType,
    ContextType,
    GraphQueryGetUserByIdArgs
  >;
};

export type GraphUserResolvers<
  ContextType = any,
  ParentType = GraphResolversTypes["User"]
> = {
  identifier?: Resolver<GraphResolversTypes["ID"], ParentType, ContextType>;
  firstName?: Resolver<GraphResolversTypes["String"], ParentType, ContextType>;
  lastName?: Resolver<GraphResolversTypes["String"], ParentType, ContextType>;
  email?: Resolver<GraphResolversTypes["String"], ParentType, ContextType>;
};

export type GraphUserPositionResolvers<
  ContextType = any,
  ParentType = GraphResolversTypes["UserPosition"]
> = {
  identifier?: Resolver<GraphResolversTypes["ID"], ParentType, ContextType>;
  user?: Resolver<GraphResolversTypes["User"], ParentType, ContextType>;
  location?: Resolver<
    Array<GraphResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  created?: Resolver<GraphResolversTypes["String"], ParentType, ContextType>;
};

export type GraphResolvers<ContextType = any> = {
  Post?: GraphPostResolvers<ContextType>;
  PostPosition?: GraphPostPositionResolvers<ContextType>;
  Mutation?: GraphMutationResolvers<ContextType>;
  Query?: GraphQueryResolvers<ContextType>;
  User?: GraphUserResolvers<ContextType>;
  UserPosition?: GraphUserPositionResolvers<ContextType>;
};

export type GraphDirectiveResolvers<ContextType = any> = {
  union?: GraphUnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: GraphAbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: GraphEntityDirectiveResolver<any, any, ContextType>;
  column?: GraphColumnDirectiveResolver<any, any, ContextType>;
  id?: GraphIdDirectiveResolver<any, any, ContextType>;
  link?: GraphLinkDirectiveResolver<any, any, ContextType>;
  embedded?: GraphEmbeddedDirectiveResolver<any, any, ContextType>;
  map?: GraphMapDirectiveResolver<any, any, ContextType>;
};

import { ObjectID } from "mongodb";
