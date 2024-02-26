import { UsersLoader } from "../graphql/loaders/users-loader";

export interface GraphQLContext {
  user: {
    id: string;
  };
  dataSources: {
    users: UsersLoader;
  };
}
