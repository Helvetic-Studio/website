import { createEnv } from "@t3-oss/env-nextjs";

/**
 * @public
 */
export const env = createEnv({
  client: {},
  runtimeEnv: {},
  skipValidation: Boolean(process.env["SKIP_ENV_VALIDATION"]),
  emptyStringAsUndefined: true,
});
