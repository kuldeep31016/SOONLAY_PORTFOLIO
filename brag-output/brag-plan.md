# Brand film plan: Soonlay, "Turning ideas into real products."

## What is Soonlay?
A product development studio in Bangalore. It designs, builds and scales web apps, mobile apps, SaaS platforms, business software and AI-powered products for startups and growing businesses.

## The angle
One continuous line becomes a product. A single point of light draws the edge of an interface. The interface gains structure (UI, then systems, then data), and that structure becomes the real products Soonlay has shipped. Finally, everything collapses back into one sentence. The film is about **transformation**, not features, and it carries the studio's own tagline, which appears word for word on the site.

## Hook (0–3.5s)
Darkness, then one point of light, then a hairline that becomes the corner of a screen. It's quiet, so the viewer leans in.

## Key moments
1. Hairlines assemble into a believable, generic product interface: a browser plus a phone, with cards, a table and a chart arriving one by one.
2. The interface separates in depth into layers (interface, API, data) connected by moving data pulses. This is the "built underneath" moment.
3. A morph montage of **real Soonlay project screenshots** from `/public/images`: AI Powered Healthcare System (web), then Apna Khaata (mobile), then Stock Management System (dashboard), then back to the healthcare AI view.

## Outro
Everything collapses to the logo and "Turning ideas / into real products." This is the musical peak. Then the call to action: "Have an idea worth building?", then "Let's build it.", then "Start a Project · soonlay.tech".

## Tone
- Preset: cinematic, restrained toward polished
- Direction: a quiet premium brand film from a product design studio
- Interpretation: few words, long holds, slow camera, and motion that always has a reason. Impressive through restraint.

## Format and duration
Landscape 1920×1080 at 30 fps, **26 s**. All text sits in a centre-safe area so the film can be reframed to 9:16.

## Visual identity (from the codebase)
- Background: #07110F (near-black teal). Surface: #0E1C19
- Text: #EAF2EF (off-white). Secondary: #A9BCB6
- Accent: #9FE6CD / #8EDCC2 (mint), used for key words
- Highlight: #FF6B4A (coral), used at most twice
- Display font: Fraunces (the "real products." italic treatment from the hero)
- Body and labels: DM Sans, tracked uppercase labels
- Logo: `/public/logo.png` (teal S with rocket, transparent)
- Real work: `/public/images/Telemedine-*.png`, `khaata-*.png`, `mydukan-*.png`, `travel-*.png`
- Verified claims only: "20+ projects designed, built and shipped" (shown on the site) and the capability list. No clients, awards or invented numbers.

## Storyboard (26 s)

| # | Time | On screen | Text | Sound |
|---|---|---|---|---|
| 1 Idea | 0.0–3.5 | Black. A point of light breathes. Two hairlines draw out from it and turn into a screen's corner. Faint teal haze. | "Every product starts with an idea." | Low drone fades in; one soft tick when the line starts |
| 2 Interface | 3.5–8.0 | The hairline frame fills: browser chrome, sidebar, stat cards, table rows, a chart line drawing. A phone frame slides in beside it with parallax. Generic UI, no client names. | "From idea to interface." | A slow sub pulse begins; a quiet click on each card |
| 3 Build | 8.0–13.0 | The camera tilts. The interface splits into three depth layers (Interface, API, Data) joined by thin mint lines with pulses. Web and mobile both feed the same API. Small code fragments at 20% opacity. | "Design." "Build." "Scale." (one at a time) | Pulse tightens; soft data ticks travel with the pulses |
| 4 Real products | 13.0–18.5 | Morph montage of real screenshots in dark glass frames, with slow push-ins: AI Powered Healthcare System (web), then Apna Khaata (phone), then Stock Management System (dashboard), then the healthcare AI view. Small labels. | Labels: "AI healthcare platform", "Billing app", "Stock management" | A low whoosh on each morph, building toward the swell |
| 5 Soonlay | 18.5–23.0 | Complexity collapses to the centre. Logo, then the headline. | "PRODUCT DEVELOPMENT STUDIO" / "Turning ideas / into *real products.*" / "Web · Mobile · SaaS · Business Software · AI" | **Musical peak**: a warm low hit as the headline lands, then the pad opens |
| 6 CTA | 23.0–26.0 | Dark and calm, like the opening of the website. | "Have an idea worth building?" then "Let's build it." then the logo, "Start a Project" and "soonlay.tech" | Pad resolves; one soft bell on the CTA; clean fade |

## Audio direction
- **Music:** an original dark-ambient electronic score composed for this film (generated in code, so it is fully owned and has no licence issues). It has a D-minor drone, a subtle sub pulse, soft digital textures and minimal percussion. It builds gradually, peaks on the headline and resolves on the CTA. The skill's bundled "happy beats" tracks don't fit this brief, so they are not used.
- **SFX:** sparse and quiet CC0 interface ticks and clicks plus one or two low whooshes and impacts, each fired on the frame its motion happens.
- **Restraint:** no risers, no EDM drops and no stingers under text. The film must work fully on mute.

## Editable config
Scene durations, all text, colours, logo path, soundtrack file and CTA live in one `config.js` in the composition folder.

## Deliverables
`brag-output/brag.mp4`, `brag-output/brag.jpg` (poster), `brag-output/composition/` (source, config and assets), and this plan.
