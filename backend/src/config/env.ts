import "dotenv/config";

const requiredEnv = (
  name: string,
  value: string | undefined
): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const env = {
  PORT: Number(process.env.PORT) || 5000,

  MONGO_URI: requiredEnv(
    "MONGO_URI",
    process.env.MONGO_URI
  ),

  JWT_ACCESS_SECRET: requiredEnv(
    "JWT_ACCESS_SECRET",
    process.env.JWT_ACCESS_SECRET
  ),

  JWT_REFRESH_SECRET: requiredEnv(
    "JWT_REFRESH_SECRET",
    process.env.JWT_REFRESH_SECRET
  ),

  CLIENT_URL:
    process.env.CLIENT_URL || "http://localhost:5173",
};

export default env;