export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GraphMutation = {
  createPost: GraphPost;
  deletePost?: Maybe<GraphPost>;
  likePost?: Maybe<GraphPost>;
  unlikePost?: Maybe<GraphPost>;
  updateOwnPosition: GraphUserPosition;
};

export type GraphMutationCreatePostArgs = {
  input: GraphPostInput;
};

export type GraphMutationDeletePostArgs = {
  post: Scalars["ID"];
};

export type GraphMutationLikePostArgs = {
  post: Scalars["ID"];
};

export type GraphMutationUnlikePostArgs = {
  post: Scalars["ID"];
};

export type GraphMutationUpdateOwnPositionArgs = {
  longitude: Scalars["Float"];
  latitude: Scalars["Float"];
};

export type GraphPost = {
  identifier: Scalars["ID"];
  title: Scalars["String"];
  content: Scalars["String"];
  images: Array<Scalars["String"]>;
  imagesCount: Scalars["Int"];
  position: GraphPostPosition;
  author: GraphUser;
  likedBy: Array<GraphUser>;
  likedByCount: Scalars["Int"];
  created: Scalars["String"];
};

export type GraphPostInput = {
  title: Scalars["String"];
  content: Scalars["String"];
  images?: Maybe<Array<Scalars["String"]>>;
  position: GraphPostPositionInput;
};

export type GraphPostPosition = {
  longitude: Scalars["Float"];
  latitude: Scalars["Float"];
};

export type GraphPostPositionInput = {
  longitude: Scalars["Float"];
  latitude: Scalars["Float"];
};

export type GraphQuery = {
  getPosts?: Maybe<Array<Maybe<GraphPost>>>;
  getPostById?: Maybe<GraphPost>;
  getUsers?: Maybe<Array<Maybe<GraphUser>>>;
  getUserById?: Maybe<GraphUser>;
  getUserPosition?: Maybe<GraphUserPosition>;
  getNearbyUsers: Array<GraphUserPosition>;
};

export type GraphQueryGetPostByIdArgs = {
  identifier: Scalars["ID"];
};

export type GraphQueryGetUserByIdArgs = {
  identifier: Scalars["ID"];
};

export type GraphQueryGetUserPositionArgs = {
  user: Scalars["ID"];
};

export type GraphQueryGetNearbyUsersArgs = {
  radiusMeters: Scalars["Int"];
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
  user: GraphUser;
  latitude: Scalars["Float"];
  longitude: Scalars["Float"];
  timestamp: Scalars["String"];
};

export type GraphUserPositionInput = {
  latitude: Scalars["Float"];
  longitude: Scalars["Float"];
};
