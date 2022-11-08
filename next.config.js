/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone'
}

module.exports = withPWA(nextConfig)
