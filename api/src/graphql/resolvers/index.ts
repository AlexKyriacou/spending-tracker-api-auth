import { Resolvers } from "../../types/graphql.js";
import { authPayloadResolvers } from "./auth-payload.js";
import { mutationResolvers } from "./mutation.js";
import { queryResolvers } from "./query.js";
import { dateScalar } from "./scalars/date.js";

export const resolvers: Resolvers = {
  Date: dateScalar,
  Query: queryResolvers,
  Mutation: mutationResolvers,
  AuthPayload: authPayloadResolvers,
};
