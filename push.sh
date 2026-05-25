#!/bin/bash
echo "🚀 Сохраняем изменения и отправляем на GitHub..."
git add .
git commit -m "Auto-update: $(date +%H:%M)"
git pull --rebase origin main
git push
echo "✅ Готово! Сайт обновится через 1-2 минуты."
