import { get } from "http";
import { GraphQLContext } from "../../types/graphql-context.js";
import {
  AuthPayload,
  MutationResolvers,
  MutationSignUpArgs,
} from "../../types/graphql.js";
import { createToken } from "../../auth/jwt.js";

export const mutationResolvers: MutationResolvers = {
  signIn: async (_parent, _args, _context, _info) => {
    throw new Error("Resolver not implemented");
  },
  signUp: async (
    parent,
    args: MutationSignUpArgs,
    context: GraphQLContext,
    info,
  ): Promise<AuthPayload> => {
    try {
      // Extract input from arguments
      const { input } = args;
      console.log("input", input)
      // Create new user
      const newUser = await context.dataSources.users.createUser(input);

      // Generate JWT token for the new user
      const token = createToken(newUser);
      // Return AuthPayload
      return {
        token,
        user: newUser,
      };
    } catch (error) {
      throw new Error("Failed to sign up: " + String(error));
    }
  },
};
