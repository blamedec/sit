// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // If you're doing static exports
  // OR
  output: undefined, // If you need server-side features
};

module.exports = nextConfig;