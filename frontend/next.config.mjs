const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/get/all-dataset",
        destination: "/dataset",
      },
    ];
  },
};

export default nextConfig;
