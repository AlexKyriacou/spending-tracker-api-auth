import {
  BatchedLoader,
  BatchedSQLDataSource,
  BatchedSQLDataSourceProps,
} from "@nic-jennings/sql-datasource";
import { SignUpInput, User } from "../../types/graphql";
import { UsersTableRow } from "../../types/db_types";
import {
  hashPassword,
  passwordMeetsRequirements,
} from "../../auth/password";

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

    // Check if password meets complexity requirements
    if (!passwordMeetsRequirements(input.password)) {
      throw new Error("Password does not meet complexity requirements.");
    }

    // Encrypt the password with bcrypt
    const hashedPassword = await hashPassword(input.password);
    input.password = hashedPassword;

    try {
      const [row] = await this.db
        .write("users")
        .insert(input)
        .returning<[UsersTableRow]>("*");
      const newUser = mapUserFields(row);
      return newUser;
    } catch (error) {
      throw new Error("Failed to create user: " + String(error));
    }
  }

  async getUserByUsernameOrEmail(
    usernameOrEmail: string
  ): Promise<User | null> {
    try {
      const [row] = await this.db.query
        .select("*")
        .from({ u: "users" })
        .where("u.username", usernameOrEmail)
        .orWhere("u.email", usernameOrEmail)
        .limit(1);

      if (!row) {
        return null;
      }

      const user = mapUserFields(row);
      return user;
    } catch (error) {
      throw new Error(
        "Failed to get user by username or email: " + String(error)
      );
    }
  }
}
