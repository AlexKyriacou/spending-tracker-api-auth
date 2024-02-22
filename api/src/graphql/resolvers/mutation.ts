import { MutationResolvers } from "../../types/graphql.js";

export const mutationResolvers: MutationResolvers = {
    signIn: async (_parent, _args, _context, _info) => {
        throw new Error('Resolver not implemented');
    },
    signUp: async (_parent, _args, _context, _info) => {
        throw new Error('Resolver not implemented');
    },
};