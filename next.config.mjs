/** @type {import('next').NextConfig} */
const nextConfig = {
  // Variabili pubbliche esposte al client - identificano questa app nel database condiviso
  env: {
    NEXT_PUBLIC_APP_SOURCE: "app_pionieri",
    NEXT_PUBLIC_ADMIN_USERNAME: "cipollas",
  },

  // Allow cross-origin requests from v0 preview domains
  allowedDevOrigins: [
    "*.vusercontent.net",
    "*.vercel.app",
  ],
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

export default nextConfig
