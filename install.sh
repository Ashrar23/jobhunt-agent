#!/bin/zsh
# Install the job-hunt skills into Claude Code and set up this folder as your workspace.
set -e
cd "$(dirname "$0")"
WS="$(pwd)"

mkdir -p ~/.claude/skills
for dir in skills/*/; do
  name=$(basename "$dir")
  if [ -e ~/.claude/skills/$name ]; then echo "skip: ~/.claude/skills/$name already exists"; continue; fi
  mkdir -p ~/.claude/skills/$name
  sed "s|{{WORKSPACE}}|$WS|g" "$dir/SKILL.md" > ~/.claude/skills/$name/SKILL.md
  echo "installed /$name"
done

[ -f profile/resume.md ] || cp profile/resume.example.md profile/resume.md
[ -f profile/preferences.md ] || cp profile/preferences.example.md profile/preferences.md
[ -f profile/board.json ] || cp profile/board.example.json profile/board.json
[ -f tracker.csv ] || cp tracker.example.csv tracker.csv
mkdir -p scans applications && touch scans/seen.txt
sed "s|{{WORKSPACE}}|$WS|g" scheduled/daily-job-scan.md > scheduled/daily-job-scan.local.md
chmod +x render.sh
command -v npm >/dev/null && npm install --silent || echo "npm not found: Word export (render_docx.js) needs Node.js"

cat <<MSG

Done. Next:
  1. Fill in profile/resume.md and profile/preferences.md with your real details.
  2. Open Claude Code in $WS and type /job-scan.
  3. Optional: daily scans (scheduled/daily-job-scan.local.md) and the dashboard (see README).
MSG
