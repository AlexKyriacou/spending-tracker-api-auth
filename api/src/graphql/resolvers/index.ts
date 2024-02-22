import { mutationResolvers } from "./mutation.js";
import { queryResolvers } from "./query.js";
import { dateScalar } from "./scalars/date.js";

export const resolvers = {
    Date: dateScalar,
    Query: queryResolvers,
    Mutation: mutationResolvers,
}