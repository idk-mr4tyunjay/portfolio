import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  experimental: {
    optimizePackageImports: ["@react-three/drei", "@react-three/fiber"],
  },
  /*
    When .glsl/.vert/.frag files land in src/shaders/, add raw-source rules here.
    Both runtimes need it — Turbopack for `next dev`, webpack for `next build`.

    turbopack: {
      rules: {
        "*.{glsl,vs,fs,vert,frag}": { loaders: ["raw-loader"], as: "*.js" },
      },
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        type: "asset/source",
      });
      return config;
    },
  */
};

export default nextConfig;
