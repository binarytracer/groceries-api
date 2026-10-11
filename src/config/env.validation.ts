import * as Joi from 'joi';

/** Checked once at startup: the app refuses to boot on a bad environment. */
const semver = Joi.string().pattern(/^\d+\.\d+\.\d+$/);

export const envValidationSchema = Joi.object({
  IP: Joi.string().default('localhost'),
  PORT: Joi.number().port().default(3000),
  JWT_SECRET: Joi.string().min(16).required(),

  // Mobile app release info served by GET /version.
  APP_LATEST_VERSION: semver.default('1.0.0'),
  APP_MIN_VERSION: semver.default('1.0.0'),
  ANDROID_STORE_URL: Joi.string().uri().allow('').default(''),
  IOS_STORE_URL: Joi.string().uri().allow('').default(''),
});
