import { fileURLToPath } from 'node:url';
import createJiti from 'jiti';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('@repo/environment-variables/rental-review');

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
