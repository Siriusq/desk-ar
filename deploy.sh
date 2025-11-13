#!/usr/bin/env sh

# 发生错误时中止
set -e

# 构建项目
npm run build

# 进入构建输出目录 (默认是 dist)
cd dist

# 初始化 git，并提交构建结果
git init
git add -A
git commit -m 'deploy: build and deploy to gh-pages'

# 将 dist 目录的内容强制推送到远程仓库的 gh-pages 分支
# 格式： git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
git push -f git@github.com:siriusq/desk-ar.git master:gh-pages

# 返回项目根目录
cd -