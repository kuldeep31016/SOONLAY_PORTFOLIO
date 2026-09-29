# Composition brief: Soonlay brand film

- Composition: `brag-output/composition/` (Hyperframes 0.8.91). Render: `brag-output/brag.mp4`. Format: 1920×1080, 30 fps, 26 s.
- Source: the Soonlay Next.js repo. Tailwind tokens (tailwind.config.ts), fonts (Fraunces + DM Sans, app/layout.tsx), hero copy (components/sections/Hero.tsx), logo (public/logo.png), real project screenshots (public/images).
- Verbatim copy: "Turning ideas into real products.", "Product Development Studio", the capability list, "Start a Project", "soonlay.tech".
- Tone: cinematic, restrained toward polished. No invented claims, clients or numbers. The illustrative UI in scene 2 is generic ("app.yourproduct.com") and is not presented as client work.
- Storyboard and audio arc: see brag-plan.md.
- Editing: `config.js` holds text, colours, logo, product list, scene durations and the soundtrack path. `audio/score.py` regenerates the original score from the same config, so cues stay in sync.
- Rebuild: `python3 audio/score.py && npx hyperframes@0.8.91 render -f 30 -q high -o ../brag.mp4`
