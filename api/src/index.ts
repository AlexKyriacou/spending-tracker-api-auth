import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./graphql/resolvers/index.js";
import { readFileSync } from "fs";

const typeDefs = readFileSync("src/graphql/schema/schema.graphql", "utf-8");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
await startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
