// module.exports = {
//     basePath: "/m",
// };
const withTM = require('next-transpile-modules')([ // 主要是用来允许这些库里的 js 能够自带 css
  '@xiaxiazheng/blog-libs', // 替换为你的库名
]);

module.exports = withTM({
  // 其他 Next.js 配置...
  basePath: "/m",
});