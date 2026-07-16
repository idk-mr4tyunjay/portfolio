---
title: "Don't run next build while next dev is running"
date: "2026-07-11"
tags: [nextjs, tooling]
summary: "Both write to .next, so the build silently corrupts the dev server and you get manifest ENOENT errors or a blank 500."
---

Twice in one day I broke my own dev server the same way: ran `npm run build` in one terminal while `next dev` was serving in another. Everything looks fine until the next reload, then:

```
Error: ENOENT: no such file or directory,
open '.next/server/app/page/build-manifest.json'
```

or just a black page with **Internal Server Error**.

## Why

`next dev` (turbopack here) and `next build` (webpack here) both write to the same `.next` directory with different layouts. The build wipes and rewrites paths the dev server is holding open, and the dev server has no idea. It keeps serving from manifests that no longer exist.

## Fix

```bash
# stop the dev server first, then:
rm -rf .next
npm run dev
```

## Rule

One `.next` owner at a time. Stop the dev server before `next build`, or point the build elsewhere (`next build --experimental-build-mode compile` setups and `distDir` tricks exist, but stopping the server is the boring reliable answer).
