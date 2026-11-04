/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'ais-dev-ibkr2nm6fjnah5k5zk2sua-803556551727.asia-southeast1.run.app',
    'ais-pre-ibkr2nm6fjnah5k5zk2sua-803556551727.asia-southeast1.run.app',
    '*.run.app',
  ],
}

export default nextConfig
