import { z } from "zod";

export const isBrowser = typeof document !== "undefined";

export const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ELECTRIC_PROXY: z.string().min(1),
  SUPABASE_URL: z.string().min(1).url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_ANON_KEY: z.string().min(1),
  TZ: z.literal("UTC"),
});

type Env = z.infer<typeof EnvSchema>;

const PublicEnvSchema = EnvSchema.pick({});

type PublicEnv = z.infer<typeof PublicEnvSchema>;

// Because we don't want to use `process.env` or `window.env` everywhere
// We need to cast here to enable intellisense on all the env variables
// We are safe because this is not the same env depending on the platform (browser or server)
export const env = (
  isBrowser ? PublicEnvSchema.parse(window.env) : EnvSchema.parse(process.env)
) as Env;

export function initEnv() {
  return env;
}

/**
 * Use that in root loader
 *
 * @returns public envs
 */
export function getBrowserEnv() {
  return {} satisfies PublicEnv;
}

declare global {
  interface Window {
    env: PublicEnv;
  }
}
