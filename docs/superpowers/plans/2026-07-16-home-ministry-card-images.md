# Home Ministry Card Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the four gray homepage ministry card placeholders with the approved 16:9 `depth-v2` images.

**Architecture:** Keep the existing homepage card array and rendering flow. Add one local public image path to each card, render it with Next.js 16's `Image` component, and preserve the current responsive card dimensions with CSS.

**Tech Stack:** Next.js 16.2.9 App Router, React 19, TypeScript, `next/image`, styled-jsx.

## Global Constraints

- Change only the four homepage ministry cards.
- Do not change ministry detail pages or `src/data/cncc_db.json`.
- Preserve the existing links, localized titles and descriptions, animation, hover behavior, and responsive layout.
- Use the four approved files under `public/images/` with the exact mapping in the design specification.
- Add no dependencies or new components.

---

### Task 1: Render approved images in the homepage ministry cards

**Files:**
- Modify: `src/app/page.tsx:3-66`
- Modify: `src/app/page.tsx:171-180`
- Modify: `src/app/page.tsx:435-441`
- Verify: `public/images/business-as-mission-16x9-depth-v2.png`
- Verify: `public/images/global-mission-16x9-depth-v2.png`
- Verify: `public/images/homeless-care-16x9-depth-v2.png`
- Verify: `public/images/worship-community-16x9-depth-v2.png`

**Interfaces:**
- Consumes: Four public image URLs and the existing localized `card.title`.
- Produces: Responsive optimized `<Image>` elements inside the existing card links.

- [ ] **Step 1: Verify all four image assets exist**

Run:

```bash
test -f public/images/homeless-care-16x9-depth-v2.png \
  && test -f public/images/global-mission-16x9-depth-v2.png \
  && test -f public/images/worship-community-16x9-depth-v2.png \
  && test -f public/images/business-as-mission-16x9-depth-v2.png
```

Expected: exit code `0` with no output.

- [ ] **Step 2: Add the Next.js Image import and exact image mapping**

Add the import:

```tsx
import Image from 'next/image';
```

Add `image` to each existing card object:

```tsx
image: '/images/homeless-care-16x9-depth-v2.png',
```

```tsx
image: '/images/global-mission-16x9-depth-v2.png',
```

```tsx
image: '/images/worship-community-16x9-depth-v2.png',
```

```tsx
image: '/images/business-as-mission-16x9-depth-v2.png',
```

- [ ] **Step 3: Replace the gray placeholder with the optimized image**

Replace:

```tsx
<div className="ministry-card-image" aria-hidden="true" />
```

With:

```tsx
<Image
  src={card.image}
  alt={card.title}
  width={1672}
  height={941}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="ministry-card-image"
/>
```

- [ ] **Step 4: Preserve the existing 16:9 crop in CSS**

Replace the placeholder background declaration with image rendering rules:

```css
.ministry-card-image {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 28px;
}
```

- [ ] **Step 5: Run static verification**

Run:

```bash
npm run lint
```

Expected: exit code `0`.

Run:

```bash
npm run build
```

Expected: exit code `0`, successful Next.js production build, and no TypeScript errors.

- [ ] **Step 6: Review the scoped diff**

Run:

```bash
git diff -- src/app/page.tsx
```

Expected: only the `Image` import, four image paths, image rendering markup, and `.ministry-card-image` rules are changed in the homepage file.

- [ ] **Step 7: Commit only the implementation and approved image assets**

```bash
git add src/app/page.tsx \
  public/images/business-as-mission-16x9-depth-v2.png \
  public/images/global-mission-16x9-depth-v2.png \
  public/images/homeless-care-16x9-depth-v2.png \
  public/images/worship-community-16x9-depth-v2.png
git commit -m "feat: add homepage ministry card images"
```
