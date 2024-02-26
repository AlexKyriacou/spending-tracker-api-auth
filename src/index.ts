import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./graphql/resolvers/index";
import { readFileSync } from "fs";
import { UsersLoader } from "./graphql/loaders/users-loader";
import { getTokenFromRequest, getUserIdFromToken } from "./auth/jwt";
import knex from "knex";
import * as dotenv from "dotenv";
dotenv.config();

const { POSTGRES_HOST_STRING, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } =
  process.env;

// Ensure that env vars are set
if (!POSTGRES_DB) {
  throw new Error("POSTGRES_DB_NAME is not set");
}
if (!POSTGRES_USER) {
  throw new Error("POSTGRES_DB_USERNAME is not set");
}
if (!POSTGRES_PASSWORD) {
  throw new Error("POSTGRES_DB_PASSWORD is not set");
}

const knexConfig = {
  client: "pg",
  connection: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${
    POSTGRES_HOST_STRING ? POSTGRES_HOST_STRING : "host.docker.internal"
  }:5432/${POSTGRES_DB}`,
};

const testDBConnection = async () => {
  const knexo = knex(knexConfig);

  try {
    await knexo.raw("SELECT 1");
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
  context: async ({ req, res }) => {
    // Get the user token from the headers.
    const token = getTokenFromRequest(req);
    const userId = getUserIdFromToken(token);

    const { cache } = server;
    return {
      user: {
        id: userId,
      },
      dataSources: {
        users: new UsersLoader({ knexConfig, cache }),
      },
    };
  },
  listen: { port: 4000 },
}).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
