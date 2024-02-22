import { UsersLoader } from "../graphql/loaders/users-loader";

export interface GraphQLContext {
  dataSources: {
    users: UsersLoader;
  };
}
