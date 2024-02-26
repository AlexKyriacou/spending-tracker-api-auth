import { UsersLoader } from "../graphql/loaders/users-loader.js";
import { User } from "./graphql.js";

export interface GraphQLContext {
  user: User;
  dataSources: {
    users: UsersLoader;
  };
}
