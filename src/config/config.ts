import { plainToInstance } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, Min, validateSync } from "class-validator";
import dotenv from "dotenv";
import logger from "../utils/logger";
import { level } from "winston";

// Load environment variables
const result = dotenv.config();

if (result.error) {
  throw new Error(`Error loading .env: ${result.error}`);
}

const validNodeEnvironments = ["development", "production", "test"] as const;
type NodeEnvironment = (typeof validNodeEnvironments)[number];

class Config {
  @IsInt({ message: "The environment variable API_PORT must be an integer." })
  @Min(1, {
    message:
      "The environment variable API_PORT must be a positive number greater than 0.",
  })
  port: number;

  @IsNotEmpty({
    message:
      "The environment variable NODE_ENV is required and cannot be empty.",
  })
  @IsIn(validNodeEnvironments, {
    message: `The environment variable NODE_ENV must be one of the following: ${validNodeEnvironments.join(
      ", "
    )}.`,
  })
  env: NodeEnvironment;

  @IsNotEmpty({
    message:
      "The environment variable OPENAI_API_KEY is required and cannot be empty.",
  })
  openaiApiKey!: string;
}

logger
  .debug("Environment variables loaded")
  .profile("Environment validation took:");
const plain = {
  port: parseInt(process.env.API_PORT || "", 10),
  env: (process.env.NODE_ENV as NodeEnvironment) || "development",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
} satisfies Config;

logger.debug("Validating environment variables");
const config = plainToInstance(Config, plain);

const errors = validateSync(config, { whitelist: true });
if (errors.length > 0) {
  logger
    .debug("Validation of environment variables failed")
    .profile("Environment validation took:");
  throw new Error(
    `Configuration validation error: \n${errors
      .map((err: any) => Object.values(err.constraints || {}).join("\n"))
      .join("; ")}`
  );
}
logger
  .debug("Successfully validated environment variables")
  .profile("Environment validation took:", { level: "debug" });

export { config };
