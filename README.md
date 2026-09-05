# Yuxi Dai

A personal portfolio of design, experiments, and observations. Warm editorial typography, a selected-work homepage, and a quieter space for photographs and drawings.

## Pages

- `index.html`: selected work and a compact index.
- `projects/`: When Text Meets Map, Suzhou-inspired jewelry, Memory Tides, and Casita City.
- `explorations.html`: photography and drawings, with an accessible image viewer.
- `about.html`: personal story, background, and contact.
- `resume.html`: the full résumé, with print/PDF styles.
- `work.html`: other projects in expandable entries. Legacy project links continue to resolve.

The site uses plain HTML, CSS, and JavaScript. Content remains readable without JavaScript. Edit each HTML page directly; shared presentation is in `style.css` and progressive interactions in `main.js`. Original images remain in `assets/`; web-sized copies are in `assets/web/`.

## Preview and validate

Run `python3 -m http.server 8000 --bind 127.0.0.1` and open `http://127.0.0.1:8000`.

Run `python3 scripts/build.py` to check page structure, local links, anchors, filename case, and image metadata, and stage the referenced public files in `dist/`. No dependency installation is required. Original full-size media and design previews are excluded from that output.

The existing homepage Google Analytics ID and `?ga=off` / `?ga=on` preference are preserved in `analytics.js`. The domain in `CNAME` remains `yuxidai.com`. Sites configuration is in `.openai/hosting.json`.
