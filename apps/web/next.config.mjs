/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "picsum.photos",
      "images.unsplash.com",
      "aceternity.com"
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;