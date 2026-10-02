---
name: job-track
description: View and update the user's job application pipeline (tracker.csv): log applications, status changes, interviews, rejections, and list follow-ups that are due. Use when the user says "I applied to…", "got an interview with…", "rejected by…", "what's my pipeline", "any follow-ups due", or "/job-track".
---

# Application tracker

Workspace: `{{WORKSPACE}}`. The file is `tracker.csv` (schema in `CLAUDE.md`).

**Board:** before starting, pull changes from the Job Hunt board, and after any tracker.csv change, push them back. Follow the "Job Hunt board" section of `{{WORKSPACE}}/CLAUDE.md`.

## Updating
Parse what the user said and update the matching row, matching on company and role with a fuzzy match. Ask if more than one row could match. If no row exists, add one.
- **applied** → set `applied_on` = today, `next_action="follow up"`, `next_action_due` = today + 7 days
- **screening / interviewing** → record the date and stage in `notes`, set `next_action` (for example "prep for tech round") and the due date. Suggest `/job-prep <id>`.
- **rejected / withdrawn / offer** → set the status, clear `next_action`, and add a one-line reason to `notes` if one was given.
- Keep the CSV valid: quote fields that contain commas, and keep the header row.

## Viewing (no update given)
Print a compact summary:
1. counts per status
2. **Due or overdue** actions (`next_action_due` ≤ today), oldest first
3. `applied` roles older than 21 days with no response, with a suggestion to mark them `ghosted` or send a final follow-up
4. the top 5 `found` / `shortlisted` roles by `fit_score` that haven't been tailored yet

When a follow-up is due, offer to draft a short follow-up message for the user to send. Never send it yourself.
