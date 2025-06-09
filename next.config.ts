
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add the allowedDevOrigins configuration here
  allowedDevOrigins: [
    'https://6000-firebase-studio-1749179803855.cluster-qhrn7lb3szcfcud6uanedbkjnm.cloudworkstations.dev',
    'http://localhost:9002',
    'https://estudio-smoky-eta.vercel.app',
    'https://estudio-charles-nogueira-s-proje-7osq93d2p.vercel.app',
  ],
};

export default nextConfig;
