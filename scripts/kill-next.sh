#!/bin/bash

# Next.js開発サーバーを停止するスクリプト

echo "🔍 実行中のNext.jsプロセスを検索中..."

# ポート3000, 3002を使用しているプロセスを検索
PIDS=$(lsof -ti:3000,3002 2>/dev/null)

if [ -z "$PIDS" ]; then
  echo "✅ 実行中のNext.jsプロセスは見つかりませんでした"
else
  echo "📌 見つかったプロセス: $PIDS"
  echo "🛑 プロセスを停止します..."
  kill -9 $PIDS 2>/dev/null
  echo "✅ プロセスを停止しました"
fi

# ロックファイルを削除
if [ -f ".next/dev/lock" ]; then
  echo "🗑️  ロックファイルを削除します..."
  rm -f .next/dev/lock
  echo "✅ ロックファイルを削除しました"
fi

echo ""
echo "✅ 完了！再度 'npm run dev' を実行してください"
