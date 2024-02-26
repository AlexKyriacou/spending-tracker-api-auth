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
    // Extract input from arguments
    const { input } = args;

    // Get user by username or email
    const user = await context.dataSources.users.getUserByLoginCredentials(
      input.usernameOrEmail,
      input.password
    );
    if (!user) {
      throw new Error("Invalid username or password");
    }

    let token: string;
    try {
      // Generate JWT token for the user
      token = createToken(user);
    } catch (error) {
      throw new Error("Failed to create token: " + String(error));
    }

    // Return AuthPayload
    return {
      token,
      user,
    };
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
