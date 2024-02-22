import {
  BatchedLoader,
  BatchedSQLDataSource,
  BatchedSQLDataSourceProps,
} from "@nic-jennings/sql-datasource";
import { User } from "../../types/graphql.js";

export class UsersLoader extends BatchedSQLDataSource {
  getUsers: BatchedLoader<string, User[]>;

  constructor(config: BatchedSQLDataSourceProps) {
    super(config);

    this.getUsers = this.db.query
      .select("*")
      .from({ u: "users" })
      .batch(async (query, keys) => {
        const result = await query.whereIn("u.id", keys);
        return keys.map((x) => result?.filter((y: User) => y.id === x));
      });
  }

  async createUser(user: Partial<User>): Promise<User> {
    const [newUser] = await this.db.write("users").insert(user).returning("*");
    console.log(newUser);
    return newUser;
  }
}
