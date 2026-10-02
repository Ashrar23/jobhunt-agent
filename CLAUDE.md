# Job Hunt Workspace

This folder is a job-search agent run by Claude Code. The skills /job-scan, /job-tailor, /job-track and /job-prep (installed into ~/.claude/skills/ by `install.sh`) do their work here.

## Layout
- `profile/resume.md` is the master resume and the only source of facts about the user's experience.
- `profile/preferences.md` holds target roles, locations, salary floors and fit signals.
- `profile/board.json` holds the name, focus line and floors shown on the dashboard.
- `tracker.csv` is the pipeline, one row per role (schema below).
- `scans/YYYY-MM-DD.md` holds the daily scan results; `scans/seen.txt` lists every job URL already reported.
- `applications/<id>/` holds one folder per role: `job.md`, `notes.md` (fit analysis), `resume.html` / `.pdf` / `.docx`, `cover_letter.md`, `prep.md`.
- `templates/resume.html` is the resume layout. `render.sh` turns HTML into PDF; `node render_docx.js <resume.html>` turns it into Word.
- `board/job-hunt-board.html` is the dashboard page; `board_sync.py` exports tracker rows for it.

## Hard rules
1. **Never invent experience.** Every claim in a resume, cover letter or interview answer must trace back to `profile/resume.md`. Reword, reorder, emphasise and drop freely; never add employers, titles, dates, metrics, technologies or achievements that aren't there. Name gaps in the notes instead of hiding them.
2. **No numbers that aren't in the resume.** Where a metric would help, add `TODO(ask): …`.
3. **Never apply, send, message or submit anything** for the user: no email, Easy Apply, recruiter messages or forms. Prepare the materials; the user submits.
4. Never type passwords or personal IDs into sites.
5. Use the name exactly as written in `profile/resume.md`.
6. Write plainly. Avoid buzzwords ("passionate", "synergy", "rockstar").

## tracker.csv schema
`id,company,role,location,source_url,status,fit_score,found_on,applied_on,next_action,next_action_due,notes`
- `id`: kebab-case `company-role`, matching `applications/<id>/`
- `status`: `found` → `shortlisted` → `tailored` → `applied` → `screening` → `interviewing` → `offer` / `rejected` / `withdrawn` / `ghosted`
- `fit_score`: 0–100; dates are ISO `YYYY-MM-DD`; quote fields containing commas.

## Job Hunt board (dashboard)
Board URL: `{{BOARD_URL}}` (set this after publishing the board, see README). Its database is read and written with the `ArtifactData` tool.
Collections: `roles/<tracker id>`, `scans/<YYYY-MM-DD>`, `questions/<qid>`, `meta/board`.
If no board URL is set, skip this section.

**Pull first.** At the start of any job skill run:
1. `list` `roles`. For docs with `updated_from: "board"`, copy `status`, `applied_on`, `next_action`, `next_action_due` into tracker.csv and say what changed.
2. `list` `questions`. For docs with a non-empty `answer` and no `applied_to_resume: true`, fold the answer into `profile/resume.md` (only facts the user stated), then `update` the question with `applied_to_resume: true`.

**Push after.** When tracker.csv changes, run `python3 board_sync.py`, then one `ArtifactData` `batch`: `update` changed roles (`file_path` = `.board/roles/<id>.json`, `if_version` from the list you read), `set` new roles with one-line `why` and `gaps`, and `update` `meta/board`. After a scan, `set` `scans/<date>` as `{date, scored, added, top: [{company, role, location, score, why, url}], pattern, sources}`. New questions for the user go in `questions/<qid>` as `{text, why, applies_to, order, answer: "", answered_at: ""}`.
