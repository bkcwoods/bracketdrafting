# March Madness Pool

A very simple React + Vite March Madness pool tracker for a 4-player draft pool.

## Features

- 4-player pool setup
- Manual team drafting
- All 68 tournament teams included as selectable options
- Manual game winner entry by round
- Automatic leaderboard scoring
- Team owner and team points tracking
- Local storage persistence
- Sample data included on first load
- Mobile-friendly layout

## Scoring

- First Four win: 1 point
- Reach Round of 32: 1 point
- Reach Sweet 16: 2 points
- Reach Elite 8: 3 points
- Reach Final Four: 4 points
- Reach championship game: 5 points
- Win championship: 6 points

In the app, those points are awarded by selecting the winner of each game in that round.

## Setup

1. Install Node.js 18+ if it is not already installed.
2. Open a terminal in this folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local Vite URL shown in the terminal.

## Build

- `npm run build`
- `npm run preview`

## Notes

- All data is saved in `localStorage` under the key `march-madness-pool-state-v1`.
- The app starts with sample player drafts and sample game results so you can test immediately.
- The included 68 teams come from the official 2025 NCAA Tournament seed list. If you want to swap in a different season later, edit [`src/data/teams.js`](./src/data/teams.js).
