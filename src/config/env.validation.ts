import * as Joi from 'joi';

/** Checked once at startup: the app refuses to boot on a bad environment. */
export const envValidationSchema = Joi.object({
  IP: Joi.string().default('localhost'),
  PORT: Joi.number().port().default(3000),
  JWT_SECRET: Joi.string().min(16).required(),
});
