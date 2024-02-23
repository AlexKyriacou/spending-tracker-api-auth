import {
  BatchedLoader,
  BatchedSQLDataSource,
  BatchedSQLDataSourceProps,
} from "@nic-jennings/sql-datasource";
import { SignUpInput, User } from "../../types/graphql.js";
import bcrypt from "bcrypt";
import { UsersTableRow } from "../../types/db_types.js";

const SALT_ROUNDS = 10;

// Because the postgres table has snake
// case fields we need to convert them to camel case
// for the GraphQL schema. We also remove passwords from the result
const mapUserFields = (userRow: UsersTableRow): User => ({
  username: userRow.username,
  createdAt: userRow.created_at,
  email: userRow.email,
  id: userRow.id.toString(),
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
        const result: [UsersTableRow] = await query.whereIn("u.id", keys);
        return keys.map((x) =>
          result?.filter((y: UsersTableRow) => y.id === x).map(mapUserFields)
        );
      });
  }

  async createUser(input: SignUpInput): Promise<User> {
    // Ensure that username, password and email are provided
    if (!input.username || !input.password || !input.email) {
      throw new Error("Username, password, and email are required.");
    }

    // Encrypt the password with bcrypt
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    input.password = hashedPassword;

    const [row] = await this.db
      .write("users")
      .insert(input)
      .returning<[UsersTableRow]>("*");
    const newUser = mapUserFields(row);
    return newUser;
  }
}
