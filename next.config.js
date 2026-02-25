/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile Lit web components from the design-system for SSR compatibility
  transpilePackages: ['@clio/design-system-web-components', 'lit', '@lit/react'],
}

module.exports = nextConfig
