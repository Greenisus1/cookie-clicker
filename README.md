# Cookie Clicker

An offline, single-file browser game with upgrades and achievements.

Download `index.html` and open it in a modern browser. No accounts, packages, image downloads or internet connection needed after download. Use the Fullscreen button where your browser supports it. On a phone, the layout stacks vertically.

## What's fixed

- Auto-clicker upgrades add another automatic click per second every time.
- Each repeatable upgrade costs 50% more after each purchase, rounded up.
- Manual and automatic baking both unlock achievements. Achievements stay unlocked after spending cookies.
- The cookie is original inline SVG art, with no external image dependency.
- Progress saves in localStorage after purchases and once per second while baking, plus when the page closes or hides.
- Disabled buttons show which purchases are affordable. The cookie is keyboard-accessible.

Click upgrades start at 10 (+2 per click) and 20 (+4 per click). The auto-clicker costs 50 and its speed upgrade starts at 30. Automatic clicks use your current click value. Achievements: bake 100 cookies in total, buy five upgrades, and own an auto-clicker.

## Saving and limits

Saves stay in this browser on this device. Private browsing, blocked storage or clearing browser data can remove them. Some browsers handle local-file storage differently. The game shows a warning if saving fails. It does not sync saves or award cookies while closed or in a hidden tab. Reset asks before deleting progress. Cookie totals are capped at 1e100 to avoid numeric overflow.

## Raspberry Pi

This is the HTML game you can open on a Pi with a graphical browser. It is **not** a terminal game and is not listed in the terminal Pi App Store. No Pi hardware test was performed for this release.

## Tests

`npm install && npx playwright install chromium && npm test` uses Playwright (development-only) to test the actual single HTML file. The game itself has no dependencies.

Copyright Greenisus1. MIT license.
