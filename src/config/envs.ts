import 'dotenv/config';
import * as joi from 'joi';

interface EnvVariables {
  PORT: number;
  //PRODUCTS_MS_HOST: string;
  //PRODUCTS_MS_PORT: number;
  DATABASE_URL: string;
  NATS_SERVERS: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    //PRODUCTS_MS_HOST: joi.string().required(),
    //PRODUCTS_MS_PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config Validation Error ENV ${error}`);
}

const enVars: EnvVariables = value;

export const envs = {
  PORT: enVars.PORT,
  DATABASE_URL: enVars.DATABASE_URL,
  //PRODUCTS_MS_HOST: enVars.PRODUCTS_MS_HOST,
  //PRODUCTS_MS_PORT: enVars.PRODUCTS_MS_PORT,
  NATS_SERVERS: enVars.NATS_SERVERS,
};
