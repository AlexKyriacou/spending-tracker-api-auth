import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./graphql/resolvers/index";
import { readFileSync } from "fs";
import { UsersLoader } from "./graphql/loaders/users-loader";
const { HOST } = process.env;

const knexConfig = {
  client: "pg",
  connection: `postgresql://postgres:postgres@${
    HOST ? HOST : "localhost"
  }:5432/postgres`,
};

console.log(knexConfig);

import knex from "knex";
const testDBConnection = async () => {
  const knexo = knex(knexConfig); // Instantiate the Knex class without using the 'new' keyword
  try {
    const result = await knexo.raw("SELECT * FROM users;");
    console.log("DB connection successful");
  } catch (error) {
    console.error("DB connection failed:", error);
  } finally {
    await knexo.destroy();
  }
};
testDBConnection();

const typeDefs = readFileSync("src/graphql/schema/schema.graphql", {
  encoding: "utf-8",
});

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
  context: async () => {
    const { cache } = server;
    return {
      dataSources: {
        users: new UsersLoader({ knexConfig, cache }),
      },
    };
  },
  listen: { port: 4000 },
}).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
