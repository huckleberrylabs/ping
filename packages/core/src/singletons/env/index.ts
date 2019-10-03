type ENV = "development" | "test" | "staging" | "production";

const IsENV = (input: unknown): input is ENV =>
  (typeof input === "string" && input === "development") ||
  input === "test" ||
  input === "staging" ||
  input === "production";

const getEnv = (): ENV => {
  const { NODE_ENV } = process.env;
  if (IsENV(NODE_ENV)) return NODE_ENV;
  throw new Error(`unknown NODE_ENV: ${process.env.NODE_ENV} `);
};

// default to development
export const ENV = getEnv();
