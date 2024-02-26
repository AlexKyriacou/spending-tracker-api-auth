import { QueryResolvers, User } from "../../types/graphql";

export const queryResolvers: QueryResolvers = {
  me: async (parent, args, context, info): Promise<User> => {
    const loggedInUser = await context.dataSources.users.getUserById(context.user.id);
    if (!loggedInUser) {
      throw new Error("User not found");
    }
    return loggedInUser;
  },
};
