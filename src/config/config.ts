import { IsIn, IsInt, IsNotEmpty, Min } from "class-validator";

const validNodeEnvironments = ["development", "production", "test"] as const;
export type NodeEnvironment = (typeof validNodeEnvironments)[number];

export class Config {
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
  openaiApiKey: string;
}
