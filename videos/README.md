# Soonlay brand film: ready-to-post videos

All versions tell the same 27-second story with the same soundtrack:
idea → interface → architecture → "You bring the idea. We bring the rest." →
"See it working before you commit." → "Turning ideas into real products." → Start a Project.

| Folder | File | Size | Use it for |
|---|---|---|---|
| `website/` | `soonlay-film-16x9.mp4` | 1920×1080 (16:9) | Website, YouTube, presentations |
| `instagram/` | `soonlay-reel-9x16.mp4` | 1080×1920 (9:16) | Instagram Reels and Stories, YouTube Shorts |
| `linkedin/` | `soonlay-film-4x5.mp4` | 1080×1350 (4:5) | LinkedIn feed posts, and Instagram feed posts |

Each folder also has a cover image (`*-poster.jpg` / `*-cover.jpg`) to pick as the thumbnail.

Notes
- The website plays a smaller web encode of the 16:9 film from `public/video/soonlay-film.mp4`.
- Every version works on mute (LinkedIn and Instagram autoplay silently).
- Text in the 9:16 reel stays inside Instagram's safe area (clear of the top bar and bottom caption).

Editing and re-rendering
- Source projects live in `brag-output/`: `composition/` (16:9), `composition-vertical/` (9:16), `composition-4x5/` (4:5).
- Change text, colours or timing in each project's `config.js`, then from that folder run:
  `python3 audio/score.py && npx hyperframes@0.8.91 render -f 30 -q high -o <output.mp4>`
