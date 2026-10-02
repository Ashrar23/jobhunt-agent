---
name: job-prep
description: Prepare the user for an interview with a specific company: company research, likely questions, STAR answers grounded in the real resume, Flutter/React technical drills, and an optional live mock interview. Use when the user says "prep me for…", "mock interview", "interview with X tomorrow", or "/job-prep <id>".
---

# Interview prep

Workspace: `{{WORKSPACE}}`. Read `CLAUDE.md`, `profile/resume.md`, and `applications/<id>/job.md` + `notes.md` if they exist.

**Board:** before starting, pull changes from the Job Hunt board, and after any tracker.csv change, push them back. Follow the "Job Hunt board" section of `{{WORKSPACE}}/CLAUDE.md`.

## Prep pack: write `applications/<id>/prep.md`
1. **Company brief** (WebSearch): what the company does, its products and apps (check the App Store / Play Store listings, and look at the app if it's Flutter), recent news, tech stack clues, team size, and Glassdoor-style interview process notes if any are public. Cite links.
2. **Why you fit**: 3 talking points that map the job's needs to real resume items.
3. **Gap handling**: for each gap in `notes.md`, an honest 2-sentence answer.
4. **Behavioural questions** (6–8), each with a STAR outline built only from real resume experience. Pick 4–6 strong source stories from resume.md: a hard technical problem, a launch that shipped, cross-team work, learning something new fast, and an end-to-end build.
   Mark details that need the user's input as `TODO(ask)`, such as numbers and outcomes. Don't make them up.
5. **Technical drill** tuned to the job's stack. For example, for a Flutter/React role: Flutter (widget lifecycle, keys, rendering pipeline, isolates, platform channels / Pigeon, state management trade-offs between GetX, Bloc and Provider, performance, testing), React (hooks, rendering, state, maps), real-time (WebSocket reconnects, WebRTC basics), plus one small live-coding style problem.
6. **Questions to ask them** (5).
7. **Logistics checklist**: date, time, format and interviewer names, taken from tracker notes.

## Mock interview mode
If the user says "mock" or "quiz me", run an interactive mock: ask one question at a time, wait for the answer, then give brief, direct feedback (what was strong, what to tighten, a better phrasing). Mix behavioural and technical questions. At the end, save a scorecard to `prep.md`.

Update the tracker `notes` with the interview date if it isn't recorded already.
