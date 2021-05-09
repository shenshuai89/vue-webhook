#!/bin/bash
WORK_PATH="/usr/projects/vue-back"
cd $WORK_PATH
echo "清除老代码"
git reset --hard origin/main
git clean -f
echo "拉取最新代码"
git pull origin main
echo "开始构建"
docker build -t vue-back:1.0.0 .
echo "先停止旧容器并删除"
docker stop vue-back-container
docker rm vue-back-container
echo "启动新容器"
docker container run -p 3000:3000 --name vue-back-container -d vue-back