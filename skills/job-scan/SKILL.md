---
name: job-scan
description: Scan the web for new job openings that fit the user's profile (the target roles and locations in profile/preferences.md), score them, and add the good ones to the job-hunt tracker. Use when the user says "scan jobs", "find jobs", "any new roles", or when the daily job-scan scheduled task runs.
---

# Job scan

Workspace: `{{WORKSPACE}}`. Read `CLAUDE.md` there first and follow its hard rules.

**Board:** before starting, pull changes from the Job Hunt board, and after any tracker.csv change, push them back. Follow the "Job Hunt board" section of `{{WORKSPACE}}/CLAUDE.md`.

## Steps
1. Read `profile/resume.md`, `profile/preferences.md`, `tracker.csv` and `scans/seen.txt` (create it if it's missing).
2. Search for roles posted in the **last 7 days**. Run the searches in parallel with WebSearch, and switch to `extended` mode when results come back thin. Cover:
   - LinkedIn Jobs, the main job boards for each target location (for example Bayt, GulfTalent and NaukriGulf in the Gulf; JobStreet in Malaysia; Naukri and Cutshort in India; Indeed and Glassdoor elsewhere), and company career pages (`site:` queries are fine)
   - Remote boards: RemoteOK, We Work Remotely, Wellfound, Arc.dev, Himalayas
   - Build queries from each target role × location in preferences.md (for example "senior flutter developer dubai", "mobile engineer flutter remote")
   - Spend the most effort on the first-choice locations, following the preference order
   If the user is running this interactively and Claude in Chrome is available, you may also browse LinkedIn Jobs in their logged-in Chrome. Only read; never click Apply or Easy Apply, and never message anyone.
   **What works (learned 2026-10-02):** WebFetch gets HTTP 403 from Bayt, GulfTalent, Foundit Gulf, Indeed and ZeroTaxJobs. When the built-in browser (`mcp__Claude_Browser__*`) is available, use it instead:
   - LinkedIn: open `https://www.linkedin.com/jobs/search?keywords=Flutter&location=United%20Arab%20Emirates&f_TPR=r604800`, then use `javascript_tool` to `fetch('/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=…&location=…&f_TPR=r604800&start=0')` for each query. Get details from `/jobs-guest/jobs/api/jobPosting/<id>`. Wait about 2 seconds between calls, or results come back empty.
   - Bayt: from a bayt.com tab, `fetch` pages like `/en/<uae|qatar|saudi-arabia>/jobs/flutter-developer-jobs/?filters%5Bjb_last_modification_date_interval%5D%5B%5D=7` and the job pages themselves.
   - Never accept cookie banners, log in, or click Apply.
3. Open each promising posting (in the browser, or with WebFetch where it works) to confirm it's real, still open, and names a company. Skip anything already in `seen.txt` or `tracker.csv`.
4. Score each one 0–100 for fit:
   - stack overlap with the resume (40)
   - seniority matches "senior / higher-paid" (20)
   - location fit (15): full marks for the first-choice location, fewer for each step down the preference order
   - domain fit signals from preferences, e.g. real-time, video, maps, BLE, healthtech (15)
   - salary at or above the floor, or salary not listed (10). Use the salary floors in preferences.md, converting currencies. A listed salary below the floor scores 0 here, and the role should only be added if everything else is strong.
   Note any hard gaps, such as a required skill that isn't in the resume.
5. Write `scans/YYYY-MM-DD.md` with a table sorted by score (company, role, location, score, one-line why, gaps, link), then a short "Top 3 to apply to today" section.
6. Append every role scoring ≥ 60 to `tracker.csv` with `status=found`. Append every reported URL to `seen.txt`.
7. Finish with a short summary: how many new roles, the top 3 with links, and the next suggested step (for example `/job-tailor <id>`).

Never apply to, or contact, anyone.
