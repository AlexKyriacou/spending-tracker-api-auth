import { UsersLoader } from "../graphql/loaders/users-loader";
import { User } from "./graphql";

export interface GraphQLContext {
  user: User;
  dataSources: {
    users: UsersLoader;
  };
}
