---
name: job-tailor
description: Tailor the user's resume and write a cover letter for one specific job, staying strictly truthful to the master resume, and render a PDF. Use when the user pastes a job post or link, or says "tailor my CV for…", "write a cover letter for…", or "/job-tailor <id>".
---

# Tailor resume + cover letter

Workspace: `{{WORKSPACE}}`. Read `CLAUDE.md` first. **Rule 1 (never invent experience) matters most here.**

**Board:** before starting, pull changes from the Job Hunt board, and after any tracker.csv change, push them back. Follow the "Job Hunt board" section of `{{WORKSPACE}}/CLAUDE.md`.

## Input
A tracker `id`, a job URL, or pasted job text. If it's a URL, fetch it. If the role isn't in `tracker.csv` yet, add it.

## Steps
1. Save the posting to `applications/<id>/job.md`: company, role, location, link, the full description, and the salary if listed.
2. Analyse the fit and save it at the top of `applications/<id>/notes.md`:
   - the 6–10 key requirements and keywords (the ones ATS filters will look for)
   - for each one: **matched** (quote the resume line), **partial**, or **gap**
   - an honest fit verdict, plus what to say about the gaps (for example "learning X", or just leave it out)
3. Build `applications/<id>/resume.html` from `templates/resume.html`:
   - Write a headline that matches the role title, using wording the resume supports.
   - Write a 2–3 sentence summary that leads with what this job cares about.
   - Reorder and lightly reword bullets so the most relevant come first. Use the job's own terms where they truthfully describe the same work (for example "state management with GetX" ↔ "reactive state management").
   - Drop weakly relevant bullets so it fits within 2 pages.
   - Reorder skills to put the job's stack first. Don't add any skill that isn't in the resume.
   - Never add metrics. Use `TODO(ask)` comments where a number would help.
4. Render it with `./render.sh applications/<id>/resume.html`, then check the PDF page count (aim for ≤ 2 pages).
   - If the employer asks for a Word resume (or applies by email, as recruiters often do), also run `node render_docx.js applications/<id>/resume.html` to produce `resume.docx` in the same style. Preview it with `qlmanage -t -s 1400 -o <scratchpad> resume.docx` and Read the PNG.
5. Write `applications/<id>/cover_letter.md`: under 250 words, addressed to the company, three short paragraphs (why this role, 2 concrete proof points from the resume, close). Write it plainly with no clichés.
6. Update the tracker row to `status=tailored` and set `next_action="review + submit"`.
7. Show the user the gap analysis, the paths to the PDF and the cover letter, and any TODO questions. Remind them that they submit it themselves.
