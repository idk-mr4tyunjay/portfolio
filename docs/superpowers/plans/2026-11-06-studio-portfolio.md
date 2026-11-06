# Studio portfolio implementation plan

> For agentic workers: use subagent-driven-development for the bounded sections, with root integration and verification.

Goal: deliver the actual complete Next.js portfolio with its original illustrated 3D hero, project pages, notes, About and Contact.

Architecture: retain the Next.js App Router and factual content data. A dynamically loaded Three.js scene uses the authored Blender camera and a projected HTML version of the real work section. A pinned scroll interval expands the illustration, approaches the monitor, and releases into normal document flow. Server-rendered content remains useful without WebGL or motion.

Tech stack: Next.js 15, React 19, TypeScript, CSS modules, Three.js, existing Lenis and Markdown pipeline.

- [x] Export optimized illustrated scene, camera path, material palette and attribution.
- [x] Build selected work, side projects and six project detail routes.
- [x] Build About, Contact, footer, notes archive, article pages and not-found page.
- [x] Integrate global palette, shared navigation and screen-to-page hero.
- [x] Verify keyboard navigation, reduced motion, WebGL fallback, camera clearance and screen handoff.
- [x] Inspect desktop/mobile rendering and fix observed issues.
- [x] Run typecheck, ESLint and production build; audit the final diff.
- [x] Save the completed implementation and make the actual site available locally.

The approved design uses porcelain, plum, lilac and a restrained chartreuse accent. No user photograph, copied room/window or fabricated project claims. The user requested uninterrupted implementation rather than more concept review.

Verification: production build generates 22 pages. Browser checks cover widths 320, 390, 768 and 1440; all six project and five article routes; notes filtering and reset; command-palette focus and Escape; home hash destinations; clickable screen handoff; live motion-preference changes; and WebGL context loss. No runtime or console errors were recorded in the production route sweep. The production dependency audit reports zero vulnerabilities.
