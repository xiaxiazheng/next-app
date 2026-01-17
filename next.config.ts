import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  basePath: "/m",
  // Next.js 13+ 内置支持 transpilePackages，替代 next-transpile-modules
  // transpilePackages 会自动处理 node_modules 中的 CSS Modules，不需要 webpack 配置
  transpilePackages: ['@xiaxiazheng/blog-libs'],
};

export default nextConfig;
