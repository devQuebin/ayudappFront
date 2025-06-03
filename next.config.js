/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Configuración para mejorar la serialización y el rendimiento
    config.optimization = {
      ...config.optimization,
      moduleIds: "named", // Changed from deterministic for better debugging
      chunkIds: "named", // Changed from deterministic for better debugging
      minimize: !dev, // Only minimize in production
      splitChunks: {
        chunks: "all",
        minSize: dev ? 10000 : 20000,
        maxSize: dev ? 50000 : 90000,
        cacheGroups: {
          default: false,
          defaultVendors: false, // Renamed from vendors for clarity
          vendor: {
            name: (module) => {
              const match = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              );
              if (match) {
                const package = match[1].replace("@", "");
                return `vendor.${package}`;
              }
              return "vendor";
            },
            chunks: "all",
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            enforce: true,
            reuseExistingChunk: true,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    };

    // Añadir resolvers específicos
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      },
    }; // Configuración específica para desarrollo
    if (dev) {
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
        name: isServer
          ? process.env.NEXT_RUNTIME === "edge"
            ? "edge-server-cache"
            : "nodejs-server-cache"
          : "client-cache",
        version: "1.0.0",
      };
    }

    // Configuración para mejorar la serialización
    config.infrastructureLogging = {
      level: "error",
    };

    return config;
  }, // Optimización de imágenes
  images: {
    minimumCacheTTL: 60,
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    domains: [],
    path: "/_next/image",
  },
  experimental: {
    optimizePackageImports: [
      "@chakra-ui/react",
      "@emotion/react",
      "@emotion/styled",
    ],
    optimizeCss: {
      critters: {
        ssrMode: "strict",
      },
    },
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  output: "standalone",
  compiler: {
    styledComponents: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
};

module.exports = nextConfig;
