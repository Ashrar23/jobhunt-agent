# Daily job scan (scheduled task prompt)

In the Claude desktop app, ask Claude: "Create a scheduled task named daily-job-scan that runs weekdays at 8:30 with the prompt in scheduled/daily-job-scan.md." Then click **Run now** once so it can ask for the permissions it needs.

---

Run the daily job scan.

Work in {{WORKSPACE}}. First read {{WORKSPACE}}/CLAUDE.md and follow its hard rules. Then follow the full procedure in ~/.claude/skills/job-scan/SKILL.md:
- Read profile/resume.md, profile/preferences.md, tracker.csv and scans/seen.txt.
- Find real, open roles posted in the last 7 days that match the target roles and locations in preferences.md.
- Skip URLs already in scans/seen.txt or tracker.csv. Score each role 0–100 with the skill's rubric. Write scans/<today>.md, append roles scoring 60+ to tracker.csv with status=found, and append every reported URL to scans/seen.txt.
- List any tracker.csv rows whose next_action_due is today or earlier.
- If a board URL is set in CLAUDE.md, sync the board.

Never apply to jobs, submit forms, or message anyone.

End with a short summary: new roles found, the top 3 (company, role, score, link), follow-ups due, and a suggested next step.
