const path = require('path');
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
    // if (dev) {
    //   console.log(config, dev);
    //   config.cache = false
    // }
    // return config

    if (dev) {
      config.cache = {
        type: 'filesystem',
        // 重点关注：忽略对 node_modules 的缓存，但保留对项目源码的缓存
        managedPaths: [path.resolve(__dirname, 'node_modules/')],
        // 或者使用 buildDependencies 策略，二选一
        // buildDependencies: { ... } 
      };      
    }
    return config;
  }
});