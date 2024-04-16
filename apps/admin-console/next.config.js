/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        // Supabase Storage - localhost
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '54321',
          pathname: '/storage/v1/object/**',
        },
        {
            protocol: 'http',
            hostname: '127.0.0.1',
            port: '54321',
            pathname: '/storage/v1/object/**',
        },
        // Supabase Storage - production
        {
          protocol: 'https',
          hostname: 'mvqaugemtuynguqelykb.supabase.co',
          pathname: '/storage/v1/object/**',
        },
      ],
    },
  };

module.exports = nextConfig;
