import { Resolvers } from "../../types/graphql";
import { authPayloadResolvers } from "./auth-payload";
import { mutationResolvers } from "./mutation";
import { queryResolvers } from "./query";
import { dateScalar } from "./scalars/date";

export const resolvers: Resolvers = {
  Date: dateScalar,
  Query: queryResolvers,
  Mutation: mutationResolvers,
  AuthPayload: authPayloadResolvers,
};
