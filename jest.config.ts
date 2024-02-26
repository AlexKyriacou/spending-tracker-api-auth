import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["./api/node_modules", "./node_modules"],
};

export default config;
