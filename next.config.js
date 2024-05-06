const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
  /** @type {import("next").NextConfig} */
  const nextConfig = {
    reactStrictMode: true,

    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.resolve.fallback = {
          // if you miss it, all the other options in fallback, specified
          // by next.js will be dropped. Doesn't make much sense, but how it is
          ...config.resolve.fallback,
          // the solution
          fs: false,
          module: false,
          perf_hooks: false,
        };
      }

      return config;
    },
  };

  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import("@serwist/next")).default({
      // Note: This is only an example. If you use Pages Router,
      // use something else that works, such as "service-worker/index.ts".
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
    });
    return withSerwist(nextConfig);
  }

  return nextConfig;
};
