import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import { resolvers } from "../../../src/graphql/resolvers/index";
import assert from "assert";

const typeDefs = readFileSync("src/graphql/schema/schema.graphql", {
  encoding: "utf-8",
});

describe("authPayloadResolvers", () => {
  it("should return the resolved user if already available", async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const response = await testServer.executeOperation({
      query: "query { authPayload { user { id name } } }",
    });

    assert(response.body.kind === 'single');
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.user).toEqual({ id: "1", name: "John" });
  });
});
