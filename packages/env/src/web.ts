import { createEnv } from "@t3-oss/env-nextjs";

/**
 * Validated environment variables for the Next.js web app.
 *
 * Import this module for its side effect in `next.config` (or other entry
 * points) so missing or invalid env values fail at build/start time. Client
 * and server schemas live here; extend `client` / `server` as variables are
 * introduced.
 *
 * Set `SKIP_ENV_VALIDATION` to bypass checks in tooling that does not need
 * a full runtime environment.
 *
 * @public
 */
export const env = createEnv({
  client: {},
  runtimeEnv: {},
  skipValidation: Boolean(process.env["SKIP_ENV_VALIDATION"]),
  emptyStringAsUndefined: true,
});
