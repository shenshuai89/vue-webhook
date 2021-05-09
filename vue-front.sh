#!/bin/bash
WORK_PATH="/usr/projects/vue-front"
cd $WORK_PATH
echo "清除老代码"
git reset --hard origin/main
git clean -f
echo "拉取最新代码"
git pull origin main
echo "编译"
npm run build
echo "开始构建"
docker build -t vue-front:1.0.0 .
echo "先停止旧容器并删除"
docker stop vue-front-container
docker rm vue-front-container
echo "启动新容器"
docker container run -p 80:80 --name vue-front-container -d vue-front:1.0.0