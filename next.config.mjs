import config from './next-i18next.config.mjs';
// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

function defineNextConfig(config) {
  return config;
}

/** @type {import("next").NextConfig} */
export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  i18n: config.i18n,
});