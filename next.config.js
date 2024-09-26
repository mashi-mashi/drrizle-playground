module.exports = {
  reactStrictMode: true,
  // transpilePackages: [
  //   '@electric-sql/pglite-react', // Optional
  //   '@electric-sql/pglite',
  // ],
  experimental: {
    serverComponentsExternalPackages : ['@electric-sql/pglite'],
  },
}