# dahei-ppt

This repository is a Codex skill for generating recording-ready HTML slides.

Use this skill when the user wants a PPT-like visual, video slide, explainer frame, benchmark table, comparison page, hero page, or any single-file HTML presentation for screen recording.

## How To Use

1. Read `SKILL.md` first.
2. Read `reference/design_system.md` before writing HTML.
3. Generate one self-contained `.html` file in the user's working directory.
4. Name files with numeric prefixes, such as `01-title.html`, `02-benchmark.html`.
5. Keep the page 3:2, fixed-stage, and directly openable in a browser.

## Non-Negotiables

- One page should communicate one clear idea.
- Use the house style: warm off-white background, deep black text, small orange emphasis.
- Make text large enough for mobile video viewing.
- Reserve the bottom area for subtitles; place the visual center slightly above mathematical center.
- Avoid bottom captions, footer notes, page numbers, and visible keyboard hints.
- Keep keyboard control available in code: right arrow/space/Enter for next, left arrow/Backspace for previous.
- Prefer fewer words. Delete explanation text unless it changes viewer understanding.
- For hero pages, keep one dominant center and treat everything else as atmosphere.
- If a positioned element uses `transform: translate(...)`, preserve that transform in animations or split positioning and animation into wrapper/inner elements.

## Output Shape

The default output is a single HTML file with embedded CSS and JavaScript:

- `.stage` uses a 3:2 aspect ratio.
- The page works offline.
- No build step is required.
- No external runtime is required.

## Reference Files

- `SKILL.md`: workflow, page types, practical rules, animation pitfalls.
- `reference/design_system.md`: colors, sizing, layout, animation conventions.
- `reference/example_template.html`: reusable starter structure.
