# 停止容器
docker stop next-app

# 删除容器
docker rm next-app

# 拉取新镜像
docker pull xiaxiazheng/nextapp

# 生成新容器
docker run -d --name next-app -p 3000:3000 xiaxiazheng/nextapp

