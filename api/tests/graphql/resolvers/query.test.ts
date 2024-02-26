import { resolvers } from "../../../src/graphql/resolvers/index";
import { readFileSync } from "fs";
import { ApolloServer } from "@apollo/server";
import { GraphQLContext } from "../../../src/types/graphql-context";
import assert from "assert";
import {
  AuthPayload,
  SignInInput,
  SignUpInput,
  User,
} from "../../../src/types/graphql";
import { UsersLoader } from "../../../src/graphql/loaders/users-loader";
import { verifyToken } from "../../../src/auth/jwt";

const typeDefs = readFileSync("src/graphql/schema/schema.graphql", {
  encoding: "utf-8",
});

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

describe("me query", () => {
    it("returns the current user", async () => {
      const mockMeOutput = {
        id: "1",
        username: "test",
        email: "test@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      // Mock context with a mock users data source
      const mockContext = {
        user: { id: "1" },
        dataSources: {
          users: {
            getUserById: jest.fn().mockResolvedValue(mockMeOutput),
          } as unknown as UsersLoader,
        },
      };
  
      const response = await server.executeOperation(
        {
          query: `query {
            me {
              id
              username
              email
              createdAt
              updatedAt
            }
          }`,
        },
        {
          contextValue: mockContext,
        }
      );
  
      const expectedQueryOutput = {
        id: mockMeOutput.id,
        username: mockMeOutput.username,
        email: mockMeOutput.email,
        createdAt: mockMeOutput.createdAt.getTime(),
        updatedAt: mockMeOutput.updatedAt.getTime(),
      };
  
      assert(response.body.kind === "single");
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.me).toEqual(expectedQueryOutput);
      expect(mockContext.dataSources.users.getUserById).toHaveBeenCalledWith(mockContext.user.id);
    });
  });

  it("returns null when user ID is an empty string", async () => {
    // Mock context with a mock users data source and an empty user ID
    const mockContext = {
      user: { id: "" },
      dataSources: {
        users: {
          getUserById: jest.fn().mockResolvedValue(null),
        } as unknown as UsersLoader,
      },
    };

    const response = await server.executeOperation(
      {
        query: `query {
          me {
            id
            username
            email
            createdAt
            updatedAt
          }
        }`,
      },
      {
        contextValue: mockContext,
      }
    );

    assert(response.body.kind === "single");
    const errorMessage = response.body.singleResult.errors[0].message;
    expect(errorMessage).toBe("User not found");
    expect(response.body.singleResult.data?.me).toBeUndefined();
    expect(mockContext.dataSources.users.getUserById).toHaveBeenCalledWith(mockContext.user.id);
  });
