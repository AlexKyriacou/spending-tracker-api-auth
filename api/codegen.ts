
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/graphql/schema/schema.graphql",
  generates: {
    "src/types/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "./graphql-context.js#GraphQLContext",
      }
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
