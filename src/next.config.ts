
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
  // Adicionando allowedDevOrigins aqui também para consistência,
  // embora o next.config.ts da raiz seja o principal.
  allowedDevOrigins: [
    'https://6000-firebase-studio-1749179803855.cluster-qhrn7lb3szcfcud6uanedbkjnm.cloudworkstations.dev',
    'http://localhost:9002', 
  ],
};

export default nextConfig;
