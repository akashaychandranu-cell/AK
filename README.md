# PRAXAK — praxak.com

Site for PRAXAK, a high-retention short-form video studio.

Live: https://akashaychandranu-cell.github.io/AK/

Static site, no build step. Six pages (`index`, `work`, `services`, `plans`, `about`, `contact`) share `assets/style.css` and `assets/main.js`.
Type: Inter Tight (tightly tracked) with Instrument Serif italic for one accent phrase per headline; Syne for the wordmark, menu and buttons.
Colours: dark-only brand palette — obsidian #0F1115, electric cyan #00F0FF, royal blue #2563EB (tokens at the top of `assets/style.css`).

To swap a work clip, replace `media/wN.mp4` and `media/wN.jpg` with the same names. Work descriptions live in `assets/main.js` and on `work.html`.
The contact form opens the visitor's email app addressed to hello@praxak.com.

**Offline:** no third-party requests. Fonts are self-hosted in `assets/fonts/` (`assets/fonts.css`). `sw.js` caches every page, style, font, image and clip after the first visit, so the site works with no connection. When you change any file, bump `VERSION` in `sw.js` so returning visitors get the update.
