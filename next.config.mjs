/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3', 'bcryptjs'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/Teedud/Login',
        destination: '/admin',
      },
      {
        source: '/teedud/login',
        destination: '/admin',
      },
      {
        source: '/Teedud',
        destination: '/admin',
      },
      {
        source: '/teedud',
        destination: '/admin',
      },
      {
        source: '/Teedud/:path*',
        destination: '/admin/:path*',
      },
      {
        source: '/teedud/:path*',
        destination: '/admin/:path*',
      },
    ];
  },
};

export default nextConfig;
