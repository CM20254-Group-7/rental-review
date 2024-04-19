import { withVercelToolbar } from '@vercel/toolbar/plugins/next';
import { fileURLToPath } from 'node:url';
import createJiti from 'jiti';
const jiti = createJiti(fileURLToPath(import.meta.url));

const env = jiti('@repo/environment-variables/rental-review');

const url = env.default.NEXT_PUBLIC_SUPABASE_URL;
const [protocol, host] = url.split('://');
const [hostname, port] = host.split(':');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol,
        hostname,
        port,
        pathname: '/storage/v1/object/**',
      },
    ],
  },
};

// const withVercelToolbar = require('@vercel/toolbar/plugins/next')();
// Instead of module.exports = nextConfig, do this:
export default withVercelToolbar()(nextConfig);
