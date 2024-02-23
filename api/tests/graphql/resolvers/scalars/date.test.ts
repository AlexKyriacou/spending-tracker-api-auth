import { dateScalar } from "../../../../src/graphql/resolvers/scalars/date"; // Replace with the correct module path
import { Kind, IntValueNode, StringValueNode } from "graphql";

describe("parseLiteral", () => {
  it("should return a Date object when given an integer AST", () => {
    const ast: IntValueNode = {
      kind: Kind.INT,
      value: "1634567890", // Replace with your desired integer value
    };

    const result = dateScalar.parseLiteral(ast);

    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBe(1634567890); // Replace with the expected timestamp
  });

  it("should return null when given an invalid AST", () => {
    const ast: StringValueNode = {
      kind: Kind.STRING, // Replace with an invalid AST kind
      value: "invalid", // Replace with an invalid value
    };

    const result = dateScalar.parseLiteral(ast);

    expect(result).toBeNull();
  });
});

describe("parseValue", () => {
  it("should return a Date object when given a number", () => {
    const value = 1634567890; // Replace with your desired number value

    const result = dateScalar.parseValue(value);

    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBe(1634567890); // Replace with the expected timestamp
  });

  it("should throw an error when given a non-number value", () => {
    const value = "invalid"; // Replace with a non-number value

    expect(() => {
      dateScalar.parseValue(value);
    }).toThrow("GraphQL Date Scalar parser expected a `number`");
  });
});

describe("serialize", () => {
  it("should return the timestamp when given a Date object", () => {
    const value = new Date(1634567890); // Replace with your desired Date object

    const result = dateScalar.serialize(value);

    expect(result).toBe(1634567890); // Replace with the expected timestamp
  });

  it("should throw an error when given a non-Date value", () => {
    const value = "invalid"; // Replace with a non-Date value

    expect(() => {
      dateScalar.serialize(value);
    }).toThrow("GraphQL Date Scalar serializer expected a `Date` object");
  });
});
