#!/bin/zsh
# Render an HTML resume/cover letter to PDF with headless Chrome.
# Usage: ./render.sh applications/<id>/resume.html   -> applications/<id>/resume.pdf
set -e
in="${1:?usage: render.sh <file.html>}"
out="${in%.html}.pdf"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$out" "file://$(cd "$(dirname "$in")" && pwd)/$(basename "$in")" 2>/dev/null
echo "$out"
