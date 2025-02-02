import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { Config, NodeEnvironment } from './config';

// Load environment variables
const result = dotenv.config();

if (result.error) {
  throw new Error(`Error loading .env: ${result.error}`);
}

logger.debug('Environment variables loaded').profile('Environment validation took:');

const plain = {
  port: parseInt(process.env.API_PORT || '', 10),
  env: (process.env.NODE_ENV as NodeEnvironment) || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
} satisfies Config;

logger.debug('Validating environment variables');
const config = plainToInstance(Config, plain);

const errors = validateSync(config, { whitelist: true });
if (errors.length > 0) {
  logger.debug('Validation of environment variables failed').profile('Environment validation took:');
  throw new Error(
    `Configuration validation error: \n${errors
      .map((err: any) => Object.values(err.constraints || {}).join('\n'))
      .join('; ')}`
  );
}
logger
  .debug('Successfully validated environment variables')
  .profile('Environment validation took:', { level: 'debug' });

export { config };
