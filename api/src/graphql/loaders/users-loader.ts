import {
  BatchedLoader,
  BatchedSQLDataSource,
  BatchedSQLDataSourceProps,
} from "@nic-jennings/sql-datasource";
import { User } from "../../types/graphql.js";

// Because the postgres table has snake
// case fields we need to convert them to camel case
// for the GraphQL schema
const mapUserFields = (userRow) => ({
  username: userRow.username,
  createdAt: userRow.created_at,
  email: userRow.email,
  id: userRow.id,
  password: userRow.password,
  updatedAt: userRow.updated_at,
});

export class UsersLoader extends BatchedSQLDataSource {
  getUsers: BatchedLoader<string, User[]>;

  constructor(config: BatchedSQLDataSourceProps) {
    super(config);

    this.getUsers = this.db.query
      .select("*")
      .from({ u: "users" })
      .batch(async (query, keys) => {
        const result = await query.whereIn("u.id", keys);
        return keys.map((x) =>
          result?.filter((y: User) => y.id === x).map(mapUserFields)
        );
      });
  }

  async createUser(user: Partial<User>): Promise<User> {
    const [row] = await this.db.write("users").insert(user).returning("*");
    const newUser = mapUserFields(row);
    return newUser;
  }
}
