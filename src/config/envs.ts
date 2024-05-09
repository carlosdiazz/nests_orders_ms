import 'dotenv/config';
import * as joi from 'joi';

interface EnvVariables {
  PORT: number;
  PRODUCTS_MS_HOST: string;
  PRODUCTS_MS_PORT: number;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    PRODUCTS_MS_HOST: joi.string().required(),
    PRODUCTS_MS_PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config Validation Error ENV ${error}`);
}

const enVars: EnvVariables = value;

export const envs = {
  PORT: enVars.PORT,
  PRODUCTS_MS_HOST: enVars.PRODUCTS_MS_HOST,
  PRODUCTS_MS_PORT: enVars.PRODUCTS_MS_PORT,
};
