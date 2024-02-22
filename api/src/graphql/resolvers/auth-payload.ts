import { GraphQLContext } from "../../types/graphql-context";
import {
  AuthPayload,
  AuthPayloadResolvers,
  ResolverTypeWrapper,
  User,
} from "../../types/graphql";

export const authPayloadResolvers: AuthPayloadResolvers = {
  user: async (
    _parent: AuthPayload,
    _args,
    _context: GraphQLContext,
    _info
  ): Promise<ResolverTypeWrapper<User>> => {
    // If user is already resolved, return it
    if (_parent.user) {
      return _parent.user;
    }
    const [user] = await _context.dataSources.users.getUsers.load(
      _parent.user.id
    );
    return user;
  },
};
