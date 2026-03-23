# NumPy Dojo 🥋

An interactive, browser-based NumPy learning tool with 22 hands-on lessons. No server, no Python installation — everything runs in the browser using a custom JS-based NumPy engine that mirrors real NumPy syntax.

![NumPy Dojo](https://img.shields.io/badge/Lessons-22-orange) ![Static Site](https://img.shields.io/badge/Deploy-Vercel-black)

## Features

- **22 progressive lessons** across 8 sections: Foundations → Indexing → Operations → Reshaping → Broadcasting → Copies & Views → Advanced Ops → Linear Algebra
- **Real NumPy syntax** — write `import numpy as np`, `np.array()`, `.reshape()`, `np.linalg.solve()` etc. A Python-to-JS transpiler executes it instantly
- **Built-in code editor** with Tab support and ⌘/Ctrl+Enter to run
- **Automated validation** — exercises check your actual output, not just "did it run"
- **Progress tracking** — completion meter persists in localStorage
- **Jump to any lesson** or follow the prescribed order
- **Hints** available for every exercise

## Sections

| # | Section | Lessons |
|---|---------|---------|
| 1 | Foundations | Arrays, Properties, Generators, Random |
| 2 | Indexing & Slicing | Basic, Boolean, Fancy |
| 3 | Operations | Element-wise Math, Aggregations, Ufuncs |
| 4 | Reshaping | Reshape/Flatten, Transpose, Stacking |
| 5 | Broadcasting | Basics, Column Broadcasting |
| 6 | Copies & Views | Views vs Copies |
| 7 | Advanced Ops | Where/Select, Sorting, String Ops |
| 8 | Linear Algebra | Dot/Matmul, Inverse/Det, Solving Systems |

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Deploy — no config needed, it auto-detects the static site

Or use the CLI:

```bash
npm i -g vercel
vercel
```

## Run Locally

```bash
npx serve .
```

Then open `http://localhost:3000`.

## How It Works

The app includes a lightweight NumPy simulator written in pure JavaScript (`NP` engine) that supports:

- `NDArray` with `.shape`, `.dtype`, `.ndim`, `.T`
- Creation: `array()`, `zeros()`, `ones()`, `full()`, `arange()`, `linspace()`
- Math: element-wise `+`, `-`, `*`, `/`, `**` with broadcasting
- Indexing: slicing, boolean masks, fancy indexing
- Aggregations: `sum()`, `mean()`, `std()`, `min()`, `max()`, `argmax()`
- Reshaping: `reshape()`, `flatten()`, `transpose()`
- Stacking: `vstack()`, `hstack()`, `concatenate()`
- Ufuncs: `sin()`, `cos()`, `exp()`, `sqrt()`, `log()`, `abs()`, `round()`
- Logic: `where()`, `sort()`, `argsort()`, `unique()`
- Strings: `char.upper()`, `capitalize()`, `str_len()`
- Linear algebra: `dot()`, `matmul()`, `linalg.det()`, `inv()`, `solve()`
- Random: `default_rng()` with seeded `random()`, `integers()`, `normal()`

A Python→JS transpiler converts your code at runtime, mapping NumPy idioms to the JS engine.

## License

MIT
