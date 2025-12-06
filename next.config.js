// module.exports = {
//     basePath: "/m",
// };
const withTM = require('next-transpile-modules')([ // 主要是用来允许这些库里的 js 能够自带 css
  '@xiaxiazheng/blog-libs', // 替换为你的库名
]);

module.exports = withTM({
  // 其他 Next.js 配置...
  basePath: "/m",
  webpack: (config, { dev, isServer }) => {
    // 仅在开发模式下禁用缓存，解决库的 yalc 的热更新问题
    if (dev) {
      config.cache = false
    }
    return config
  }
});