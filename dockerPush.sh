# 打包
yarn build

# 生成镜像
docker build -t xiaxiazheng/nextapp:latest .

# 上传到 hub
docker push xiaxiazheng/nextapp