#!/usr/bin/env bash
# deploy.sh - 跨平台部署脚本
# 用法: ./deploy.sh ["commit message"]
# 无参数时自动生成时间戳 commit message

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

# 生成 commit message
if [ $# -eq 0 ]; then
  COMMIT_MSG="update $(date '+%Y-%m-%d %H:%M:%S')"
else
  COMMIT_MSG="$*"
fi

echo "📦 正在部署到 GitHub Pages..."
echo "   Commit: $COMMIT_MSG"

# 检查是否有未跟踪或修改的文件
if [ -z "$(git status --porcelain)" ]; then
  echo "✅ 工作区干净，无需提交"
  exit 0
fi

# 显示将要提交的文件
git status --short

# 提交并推送
git add .
git commit -m "$COMMIT_MSG"
git push

echo "✅ 部署完成！"
echo "   访问: https://michaelguan.github.io"
echo "   GitHub Pages 通常在 30-60 秒内更新"