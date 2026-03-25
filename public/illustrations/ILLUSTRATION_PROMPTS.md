# Lesson illustrations — file names and AI prompts

Save exports as **PNG** (or WebP if you update `src` in `lessons.ts`) in this folder:

**`public/illustrations/`**

Names must match exactly (they align with URL slugs from lesson titles).

---

## Tools that usually beat “hand-coded SVG” for polish

| Tool | Best for |
|------|----------|
| **[Napkin AI](https://www.napkin.ai/)** | Clean explainer / product-style diagrams from a short description; strong default typography. |
| **[Figma](https://www.figma.com/)** (templates + components) | Pixel-perfect, on-brand diagrams; best if you want a **consistent design system** (reuse frames, colors, icons). |
| **[Recraft](https://www.recraft.ai/)** | Vector-first, brand-consistent graphics; good when you want editable structure. |
| **[Midjourney](https://www.midjourney.com/)** / **[Ideogram](https://ideogram.ai/)** | Atmospheric or metaphorical illustrations; add **“diagram, flat vector, no photorealism, minimal text labels”** or text will be unreliable. |
| **ChatGPT / Gemini + image** | Quick iterations; same caveat: spell out **exact short labels** and ask for a **simple diagram**, not a poster. |

**Practical combo:** generate structure in **Napkin** or lay out in **Figma**, export **PNG @2x** (e.g. 2× the `width`/`height` in `lessons.ts`) for sharp retina display.

---

## Global style block (prepend to every prompt)

Use this (or paste once as “style reference” in your tool):

> Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

---

## Files and prompts (22 images)

### `why-your-first-array.png`

> Left: four separate small boxes labeled 1–4 as “Python list” scattered objects. Right: one horizontal contiguous block “NumPy ndarray” same numbers in one buffer. Caption vibe: list = separate objects, array = one typed contiguous block. Arrow or subtle divider between sides.

### `why-array-properties.png`

> Single 2×2 grid of numbers with three callouts: `shape (2, 2)`, `dtype int64`, `ndim 2`. Dark UI style. Looks like a metadata inspector panel.

### `why-array-generators.png`

> Four small panels in a row: (1) `zeros(2,3)` gray grid, (2) `ones(4)` row of 1s, (3) `arange(0,10,2)` stepped ticks, (4) `linspace(0,1,5)` evenly spaced dots on a line. Shared legend line “NumPy generators”.

### `why-random-arrays.png`

> Flow: `seed → Generator → random floats / integers / normal samples`. Show “same seed = same stream” as two identical small sample strips side by side labeled `seed=42`.

### `why-basic-indexing.png`

> 2D grid with row axis labeled `axis=0` (down) and column axis `axis=1` (across); one row or column lightly highlighted. Small inset 1D array showing `a[1:4]` slice highlighted.

### `why-boolean-indexing.png`

> Horizontal array of numbers with True/False row under them; filtered subset below in a second color. Label “mask” and “a[mask]”.

### `why-fancy-indexing.png`

> Base array; index list `[0,3,4]` with arrows plucking three cells into a new ordered strip. Caption: non-contiguous selection.

### `why-element-wise-math.png`

> Two aligned rows of three numbers with `+` or `*` between → result row. Label “vectorized / element-wise”.

### `why-aggregation-functions.png`

> Small 3×3 sales-style table. Arrows along `axis=1` collapsing to column of row sums; separate small diagram for `axis=0` collapsing to row of column sums.

### `why-universal-functions.png`

> Input array → block labeled `ufunc` (sin/exp) → output wave or transformed values. Emphasize “one function, whole array”.

### `why-reshape-and-flatten.png`

> Twelve numbered cells shown as 1×12 strip and as 3×4 grid; curved arrow “same data, new view”. Optional footnote “C-order”.

### `why-transpose.png`

> 2×3 matrix on left, 3×2 on right, arrows showing rows becoming columns. Label `m.T`.

### `why-stacking-and-splitting.png`

> Top: two narrow matrices `vstack` into taller one (same width). Bottom: two matrices `hstack` side by side (same height). Simple icons, no clutter.

### `why-broadcasting-basics.png`

> 2×3 grid plus length-3 vector aligned on top; faint ghost copies of vector behind each row to show virtual repeat. Label “broadcast”.

### `why-column-broadcasting.png`

> Matrix multiplied row-wise by a **column** vector shape `(n,1)` drawn as vertical stack of scalars beside each row. Contrast with a wrong “row vector” ghost crossed out lightly.

### `why-views-vs-copies.png`

> One buffer rectangle; slice highlights a window labeled “view shares memory”. Second path: slice copies into new buffer labeled `.copy()` independent.

### `why-where-and-select.png`

> Branching diagram: condition true path picks values from A, false path from B, merges into result array. Label `np.where`.

### `why-sorting-and-searching.png`

> Unsorted bar chart row; below it index row from `argsort`; bottom sorted values. Arrows showing permutation.

### `why-string-operations.png`

> Column of lowercase words → pipeline `capitalize` → capitalized column; parallel row `str_len` → lengths. Small `np.char` label.

### `why-dot-product-and-matmul.png`

> Left: matrix `(m×k)` × vector `(k)` → `(m)`. Right: small inset dot product as sum of pairwise products. Dim labels only, no real numbers needed.

### `why-inverse-and-determinant.png`

> Square matrix A, inverse A⁻¹, product ≈ I (identity grid). Badge “det(A)” with green OK vs red “≈0 singular”. Educational, not busy.

### `why-solving-linear-systems.png`

> Two lines crossing at point x in 2D plane; side mini equation `Ax = b`. Emphasize geometric “intersection of constraints”.

---

## Combined copy-paste prompts

Save each export as **PNG** to `public/illustrations/` using the **filename** shown above each block. Copy the entire fenced block (style + scene) into your image tool.

### `why-your-first-array.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Left: four separate small boxes labeled 1–4 as "Python list" scattered objects. Right: one horizontal contiguous block "NumPy ndarray" same numbers in one buffer. Caption vibe: list = separate objects, array = one typed contiguous block. Arrow or subtle divider between sides.
```

### `why-array-properties.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Single 2×2 grid of numbers with three callouts: shape (2, 2), dtype int64, ndim 2. Dark UI style. Looks like a metadata inspector panel.
```

### `why-array-generators.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Four small panels in a row: (1) zeros(2,3) gray grid, (2) ones(4) row of 1s, (3) arange(0,10,2) stepped ticks, (4) linspace(0,1,5) evenly spaced dots on a line. Shared legend line "NumPy generators".
```

### `why-random-arrays.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Flow: seed → Generator → random floats / integers / normal samples. Show "same seed = same stream" as two identical small sample strips side by side labeled seed=42.
```

### `why-basic-indexing.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

2D grid with row axis labeled axis=0 (down) and column axis axis=1 (across); one row or column lightly highlighted. Small inset 1D array showing a[1:4] slice highlighted.
```

### `why-boolean-indexing.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Horizontal array of numbers with True/False row under them; filtered subset below in a second color. Label "mask" and "a[mask]".
```

### `why-fancy-indexing.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Base array; index list [0,3,4] with arrows plucking three cells into a new ordered strip. Caption: non-contiguous selection.
```

### `why-element-wise-math.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Two aligned rows of three numbers with + or * between → result row. Label "vectorized / element-wise".
```

### `why-aggregation-functions.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Small 3×3 sales-style table. Arrows along axis=1 collapsing to column of row sums; separate small diagram for axis=0 collapsing to row of column sums.
```

### `why-universal-functions.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Input array → block labeled ufunc (sin/exp) → output wave or transformed values. Emphasize "one function, whole array".
```

### `why-reshape-and-flatten.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Twelve numbered cells shown as 1×12 strip and as 3×4 grid; curved arrow "same data, new view". Optional footnote "C-order".
```

### `why-transpose.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

2×3 matrix on left, 3×2 on right, arrows showing rows becoming columns. Label m.T.
```

### `why-stacking-and-splitting.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Top: two narrow matrices vstack into taller one (same width). Bottom: two matrices hstack side by side (same height). Simple icons, no clutter.
```

### `why-broadcasting-basics.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

2×3 grid plus length-3 vector aligned on top; faint ghost copies of vector behind each row to show virtual repeat. Label "broadcast".
```

### `why-column-broadcasting.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Matrix multiplied row-wise by a column vector shape (n,1) drawn as vertical stack of scalars beside each row. Contrast with a wrong "row vector" ghost crossed out lightly.
```

### `why-views-vs-copies.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

One buffer rectangle; slice highlights a window labeled "view shares memory". Second path: slice copies into new buffer labeled .copy() independent.
```

### `why-where-and-select.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Branching diagram: condition true path picks values from A, false path from B, merges into result array. Label np.where.
```

### `why-sorting-and-searching.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Unsorted bar chart row; below it index row from argsort; bottom sorted values. Arrows showing permutation.
```

### `why-string-operations.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Column of lowercase words → pipeline capitalize → capitalized column; parallel row str_len → lengths. Small np.char label.
```

### `why-dot-product-and-matmul.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Left: matrix (m×k) × vector (k) → (m). Right: small inset dot product as sum of pairwise products. Dim labels only, no real numbers needed.
```

### `why-inverse-and-determinant.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Square matrix A, inverse A⁻¹, product ≈ I (identity grid). Badge det(A) with green OK vs red ≈0 singular. Educational, not busy.
```

### `why-solving-linear-systems.png`

```
Flat technical diagram for a dark-themed coding tutorial site. Background very dark navy `#0a0d13`, panel fill `#141a24`, subtle border `#1c2433`, accent orange `#e8843c`, accent blue `#5ea3f8`, body text off-white `#eaeff6`, secondary text `#8d98ab`. Sans + monospace labels. Generous padding, rounded rectangles, no drop shadows, no 3D, no stock photos. Minimal readable labels only; no long paragraphs in the image.

Two lines crossing at point x in 2D plane; side mini equation Ax = b. Emphasize geometric "intersection of constraints".
```

---

## After you add files

- Reload the lesson page; broken images mean filename or extension mismatch.
- Optional: remove old unused `.svg` files in this folder once you no longer need them as reference.
