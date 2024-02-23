import { resolvers } from "../../../src/graphql/resolvers/index";
import { readFileSync } from "fs";
import { ApolloServer } from "@apollo/server";
import { GraphQLContext } from "../../../src/types/graphql-context";
import assert from "assert";
import { AuthPayload, SignUpInput, User } from "../../../src/types/graphql";
import { UsersLoader } from "../../../src/graphql/loaders/users-loader";
import { verifyToken } from "../../../src/auth/jwt";

describe("SignUp mutation", () => {
  it("creates a new user", async () => {
    const typeDefs = readFileSync("src/graphql/schema/schema.graphql", {
      encoding: "utf-8",
    });

    const server = new ApolloServer<GraphQLContext>({
      typeDefs,
      resolvers,
    });

    // Mock input
    const input: SignUpInput = {
      username: "test",
      email: "test@example.com",
      password: "password",
    };

    const mockCreateUserOutput: AuthPayload = {
      token: "specific-token-value",
      user: {
        id: "1",
        username: "test",
        email: "test@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    // Mock context with a mock users data source
    const mockContext = {
      dataSources: {
        users: {
          getUserByUsernameOrEmail: jest.fn().mockResolvedValue(null),
          createUser: jest.fn().mockResolvedValue(mockCreateUserOutput.user),
        } as unknown as UsersLoader,
      },
    };

    /**
     * Represents the response object returned from the signUp mutation.
     */
    const response = await server.executeOperation(
      {
        query: `mutation {
        signUp(input: {
          username: "${input.username}",
          email: "${input.email}",
          password: "${input.password}"
        }) {
          token
          user {
            id
            username
            email
            createdAt
            updatedAt
          }
        }
      }`,
      },
      {
        contextValue: mockContext,
      }
    );

    const expectedQueryOutput: AuthPayload = {
      token: mockCreateUserOutput.token,
      user: {
        id: mockCreateUserOutput.user.id,
        username: mockCreateUserOutput.user.username,
        email: mockCreateUserOutput.user.email,
        createdAt: mockCreateUserOutput.user.createdAt.getTime(),
        updatedAt: mockCreateUserOutput.user.updatedAt.getTime(),
      },
    };

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(
      (response.body.singleResult.data?.signUp as AuthPayload).user
    ).toEqual(expectedQueryOutput.user);
    expect(
      mockContext.dataSources.users.getUserByUsernameOrEmail
    ).toHaveBeenCalledWith(input.username);
    expect(
      mockContext.dataSources.users.getUserByUsernameOrEmail
    ).toHaveBeenCalledWith(input.email);
    expect(mockContext.dataSources.users.createUser).toHaveBeenCalledWith(
      input
    );
    //check to ensure that JWT token is valid and for the user we created
    const { token } = response.body.singleResult.data?.signUp as AuthPayload;
    const decodedToken: { userId: string } = verifyToken(token) as {
      userId: string;
    };
    const { userId } = decodedToken;
    expect(userId).toEqual(mockCreateUserOutput.user.id);
  });
});
