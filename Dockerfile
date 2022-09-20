# STAGE 1
# FROM node:16-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . /app/
# # RUN

# # STAGE 2
# FROM node:16-alpine
# WORKDIR /app
# RUN npm install -g webserver.local
# COPY --from=build /app/build ./build
# EXPOSE 3000
# CMD webserver.local -d ./build


# 使用 node 镜像a
FROM node:16-alpine

# 准备工作目录
WORKDIR /app

# 复制文件
COPY package*.json yarn.lock next.config.js /app/
COPY .next/ /app/.next
COPY node_modules/ /app/node_modules

# 安装依赖
# RUN yarn config set strict-ssl false && yarn --prod

EXPOSE  3000

# 启动服务
CMD ["yarn", "start"]