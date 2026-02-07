# Code review: header + scrollable main layout

## What actually fixed the bug (second try)

Only **two things** were required for “page scrolls under the header”:

1. **`body`** – Constrain to viewport and prevent body scroll:
   - `height: 100vh` / `height: 100dvh` so the layout has a fixed height
   - `overflow: hidden` so the body never gets a scrollbar

2. **`main`** – Be the only scroll container:
   - `flex-1 min-h-0 overflow-auto` so it takes remaining space and scrolls when content overflows

Everything else is either structural necessity or from the first attempt.

---

## What’s necessary vs redundant

### Body (`styles.css`)

| Piece | Verdict | Reason |
|-------|--------|--------|
| `flex flex-col` | **Keep** | Required so header and main stack and main can use `flex-1`. |
| `height: 100vh` / `height: 100dvh` | **Keep** | The actual fix; body must not grow. |
| `overflow: hidden` | **Keep** | The actual fix; body must not scroll. |
| `min-height: 100vh` / `min-height: 100dvh` | **Redundant** | With `height` set, body doesn’t grow; `min-height` doesn’t change behavior. Leftover from first-try `min-h-screen`. |

### Main (`__root.tsx`)

| Piece | Verdict | Reason |
|-------|--------|--------|
| `flex-1 min-h-0 overflow-auto` | **Keep** | All three needed: take remaining space, allow shrinking, make main the scroll area. |
| `role="main"` | **Keep** | Accessibility. |
| `id="root-page"` | **Optional** | Not referenced anywhere. Remove unless you add scroll restoration or deep-linking. |

### Header (`Header.tsx`)

| Piece | Verdict | Reason |
|-------|--------|--------|
| `shrink-0` | **Keep** | Ensures the header never shrinks in the flex layout; without it, in edge cases the header could be squashed. Makes intent clear. |

### Removed earlier (good)

- **`#root-page` in CSS** – Duplicated the main’s Tailwind layout; correctly removed.

---

## Summary

- **Necessary:** body `height` + `overflow: hidden` + `flex flex-col`; main `flex-1 min-h-0 overflow-auto`; header `shrink-0`; main `role="main"`.
- **Redundant:** body `min-height` (can remove).
- **Optional:** main `id="root-page"` (remove if not used).
