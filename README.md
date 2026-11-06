# Mruthunjay's portfolio

A Next.js portfolio with an illustrated 3D studio entrance, selected work, project pages, an About section, searchable notes and contact links.

## Run

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. For a production preview, stop the development server first, then run:

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

The development and production builds share `.next`; do not run them concurrently. Google Fonts are downloaded by Next.js at build time.

## Studio entrance

The opening looks like an illustration, rendered from a small Blender scene with flat materials and contour lines. Scrolling expands the framed scene, follows a low camera around the character, and approaches the monitor. The monitor contains HTML from the real Selected work section. Its final transition adapts to the viewport and continues into the normal document.

- `src/components/home/Hero.tsx`: scroll progress, frame expansion, projected monitor and responsive handoff.
- `src/components/home/StudioScene.tsx`: Three.js renderer, material shaders and camera interpolation. It draws on changes, not continuously while idle.
- `public/studio/`: optimized model, camera samples, fallback poster and asset credits.
- `src/components/work/MonitorContent.tsx`: the monitor's preview of the real work section.

Reduced-motion users receive the static illustration and normal page flow. WebGL or asset loading failures use the same fallback. The preview copies are inert and hidden from assistive technology; the real content is server-rendered and remains navigable without JavaScript.

## Content and routes

- Identity and biography: `src/data/site.ts`.
- Work and project detail content: `src/data/work.ts`, derived from `src/data/projects.ts`.
- Notes: `content/notes/*.md`.
- `/`: portfolio.
- `/work/[slug]`: six project pages.
- `/notes`: searchable notebook with topic filters.
- `/notes/[slug]`: article pages.

Shared navigation supports section links and a keyboard search palette. Metadata, sitemap, social images and icons use the same identity. The palette is porcelain, plum, lilac and chartreuse; global tokens live in `src/app/globals.css`.

## Asset attribution

The seated character uses adapted Snow Rig anatomy from Blender Foundation under CC BY 4.0. Furniture, materials, camera and anonymous styling were customized for this portfolio. Full attribution is in `public/studio/ATTRIBUTION.txt` and linked in the footer.
