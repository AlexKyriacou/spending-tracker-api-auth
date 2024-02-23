import { QueryResolvers } from "../../types/graphql";

export const queryResolvers: QueryResolvers = {
  me: async (_parent, _args, _context, _info) => {
    throw new Error("Resolver not implemented");
  },
};
