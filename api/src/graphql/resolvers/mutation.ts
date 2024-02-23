import { GraphQLContext } from "../../types/graphql-context.js";
import {
  AuthPayload,
  MutationResolvers,
  MutationSignInArgs,
  MutationSignUpArgs,
} from "../../types/graphql.js";
import { createToken } from "../../auth/jwt.js";

export const mutationResolvers: MutationResolvers = {
  signIn: async (
    parent,
    args: MutationSignInArgs,
    context: GraphQLContext,
    info
  ) => {
    throw new Error("Resolver not implemented");
  },
  signUp: async (
    parent,
    args: MutationSignUpArgs,
    context: GraphQLContext,
    info
  ): Promise<AuthPayload> => {
    // Extract input from arguments
    const { input } = args;

    // Check if user with the same username or email already exists
    const existingUserByUsername =
      await context.dataSources.users.getUserByUsernameOrEmail(input.username);
    const existingUserByEmail =
      await context.dataSources.users.getUserByUsernameOrEmail(input.email);
    if (existingUserByUsername || existingUserByEmail) {
      throw new Error("User with this username or email already exists");
    }

    // Create new user
    const newUser = await context.dataSources.users.createUser(input);

    let token: string;
    try {
      // Generate JWT token for the new user
      token = createToken(newUser);
    } catch (error) {
      throw new Error("Failed to create token: " + String(error));
    }

    // Return AuthPayload
    return {
      token,
      user: newUser,
    };
  },
};
