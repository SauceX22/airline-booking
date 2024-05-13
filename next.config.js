/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: false,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
      {
        hostname: "authjs.dev",
      },
      {
        hostname: "samchui.com",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "plus.unsplash.com",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default config;
