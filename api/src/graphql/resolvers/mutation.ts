import { GraphQLContext } from "../../types/graphql-context.js";
import {
  AuthPayload,
  MutationResolvers,
  MutationSignUpArgs,
} from "../../types/graphql.js";

export const mutationResolvers: MutationResolvers = {
  signIn: async (_parent, _args, _context, _info) => {
    throw new Error("Resolver not implemented");
  },
  signUp: async (
    parent,
    args: MutationSignUpArgs,
    context: GraphQLContext,
    info
  ): Promise<AuthPayload> => {
    try {
      // Extract input from arguments
      const { input } = args;

      // Create new user
      const newUser = await context.dataSources.users.createUser(input);

      // Generate token for the new user
      const token = "testtoken"; //generateToken(newUser.id); // Assuming generateToken function generates a token based on user ID

      // Return AuthPayload
      return {
        token,
        user: newUser,
      };
    } catch (error) {
      // Handle error
      throw new Error("Failed to sign up: " + error.message);
    }
  },
};
