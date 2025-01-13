/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "picsum.photos",
      "images.unsplash.com"  // Changed from "images.unsplash" to "images.unsplash.com"
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;