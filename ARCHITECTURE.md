# next-app 项目架构文档

## 1. 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16.1.1 (App Router) + React 19.2.3 |
| 语言 | TypeScript 5 |
| UI 库 | Ant Design 6.1.3 |
| 样式 | Sass + CSS Modules (`.module.scss`) |
| 内部库 | @xiaxiazheng/blog-libs v0.0.23 |
| 存储 | localforage 1.10.0 |
| 容器化 | Docker (Node 20 Alpine) |

## 2. 项目结构

```
src/
├── app/                    # App Router 页面
│   ├── blog/[blog_id]/     # 博客文章详情 (动态路由)
│   ├── cloud/               # 云存储
│   ├── login/              # 登录页
│   ├── music/              # 音乐播放器
│   ├── todo-tabs/          # 主 todo 页面 (6 个标签页)
│   ├── tomato-clock/       # 番茄钟
│   ├── translate/          # 翻译
│   ├── video/              # 视频
│   ├── tree/               # 树形图
│   ├── cmd/                # CMD 页面
│   ├── mao/                # 猫页面
│   └── layout.tsx          # 根布局
├── components/             # 组件
│   ├── common/             # 通用组件 (affix, drawer, header)
│   └── todo/               # Todo 相关组件 (24 个子组件)
├── hooks/                  # 自定义 Hooks
├── styles/                 # 全局 SCSS
└── utils/                  # 工具函数
```

## 3. 核心架构模式

- **App Router**: Next.js 13+ App Router，大量 client components (`'use client'`)
- **HOC 模式**: AddTodoHoc 高阶组件
- **Drawer 导航**: RouterDrawer 组件实现侧边抽屉导航
- **Tab 界面**: TodoTabs 组件实现 6 标签页 (todo, done, directory, mark, other, before)
- **Context**: SettingsProvider (@xiaxiazheng/blog-libs)

## 4. 状态管理

- `useStorageState` hook — 持久化布尔标志 (isFollowUp, isShowLastXdays 等)
- React useState — 组件级状态
- localStorage — 直接存储用户凭证和简单标志

## 5. 样式方案

- CSS Modules (`.module.scss`) — 组件级样式
- 全局 SCSS (`src/styles/global.scss`)
- Ant Design 默认主题 + 自定义暗色主题 (背景 #001529, 文字 #a6adb4)

## 6. 关键配置

**next.config.ts:**
```typescript
{
  reactCompiler: true,
  basePath: "/m",                    // 部署在 /m 路径下
  transpilePackages: ['@xiaxiazheng/blog-libs']
}
```

**tsconfig.json:**
- 路径别名: `@/*` → `./src/*`
- Strict 模式

## 7. 部署

- Docker: `node:20-alpine`
- 脚本: `deployPush.sh`, `deployPull.sh`, `deployPushContinue.sh`
- 命令: `yarn docker:build` → `yarn docker:push` → `yarn docker:pull`

## 8. 路由一览

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | home | 首页 (含 TodoTabs, 登录校验) |
| `/login` | login | 登录表单 |
| `/blog` | blog | 博客列表 |
| `/blog/[blog_id]` | blog | 博客详情 |
| `/blog-random` | blog-random | 随机博客 |
| `/music` | music | 音乐播放器 |
| `/cloud` | cloud | 云存储 |
| `/todo-tabs` | todo-tabs | 主 todo 管理 |
| `/tomato-clock` | tomato-clock | 番茄钟 |
| `/translate` | translate | 翻译 |
| `/video` | video | Qiniu 视频 |
| `/mao` | mao | 猫页面 |
| `/tree` | tree | 树形可视化 |
| `/cmd` | cmd | CMD 界面 |

## 9. 组件层级

```
LayoutWrapper (根包装器)
├── SettingsProvider
├── Loading 状态
├── Affix (固定按钮: 首页/添加/分类)
└── RouterDrawer (主导航抽屉)
```

## 10. 提需求前需了解

- 所有页面均通过 RouterDrawer 抽屉导航
- Todo 功能是核心，使用 TodoTabs 6 标签页结构
- 样式使用 SCSS + CSS Modules，不使用 Tailwind
- 内部共享库 `@xiaxiazheng/blog-libs` 提供 SettingsProvider、todo/photo API
- 部署路径为 `/m`，非根路径
