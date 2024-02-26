import { QueryResolvers, User } from "../../types/graphql.js";

export const queryResolvers: QueryResolvers = {
  me: async (parent, args, context, info): Promise<User> => {
    if (!context.user) {
      throw new Error("You are not authenticated");
    }
    return context.user;
  }
};
