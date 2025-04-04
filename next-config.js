/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Enable CORS for API routes
    async headers() {
      return [
        {
          // Allow CORS from Warpcast domains
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          ],
        },
      ];
    },
    // Extend webpack config to handle AWS SDK
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Avoid SSR issues with AWS SDK
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          crypto: false,
        };
      }
      return config;
    },
  };
  
  module.exports = nextConfig;