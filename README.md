# NumPy Dojo 🥋

An interactive, browser-based NumPy learning platform with hands-on lessons, real-world scenarios, and knowledge quizzes. No Python install needed — everything runs in the browser using a custom JS engine that mirrors real NumPy syntax.

## Features

### 📘 Lessons (22)
Progressive lessons from array creation to linear algebra, each with a built-in code editor and automated validation.

### 🌍 Scenarios (12)
Multi-step real-world problems that teach you *when* and *why* to use NumPy — not just how. Includes data analysis, finance, image processing, engineering, and everyday math.

### 📝 Quizzes
- Choose question count (10, 15, 20, 25)
- Mix of formats: multiple choice, true/false, short answer, code output
- Wrong answers get retried at the end
- Links to relevant lessons for review
- Full quiz history with per-question breakdown

### Other Features
- Progress tracking with completion meter
- Code persistence across sessions
- Copy code button
- Adjustable editor font size
- Keyboard shortcuts (⌘⏎ run, ⌘← → navigate)
- Mobile responsive

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **React 18**
- Custom NumPy JS engine (no external dependencies)
- localStorage for persistence
- Deploys to Vercel with zero config

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

Push to GitHub, import in [vercel.com/new](https://vercel.com/new), deploy. That's it.

## Project Structure

```
src/
├── app/
│   ├── globals.css      # All styles
│   ├── layout.tsx        # Root layout with fonts
│   └── page.tsx          # Main app with tabs
├── components/
│   ├── CodeEditor.tsx    # Code editor + run + output
│   ├── ConfirmDialog.tsx # Reset confirmation modal
│   ├── LessonView.tsx    # Lesson content display
│   ├── QuizView.tsx      # Quiz system (setup, questions, retry, history)
│   ├── ScenarioView.tsx  # Multi-step scenario view
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── Toast.tsx         # Toast notifications
├── data/
│   ├── lessons.ts        # 22 lesson definitions
│   ├── quizzes.ts        # 42 quiz questions
│   ├── scenarios.ts      # 12 real-world scenarios
│   └── types.ts          # TypeScript interfaces
└── lib/
    ├── executor.ts       # Python→JS transpiler + runner
    ├── numpy.ts          # NumPy JS engine (NDArray, np.*)
    └── storage.ts        # localStorage helpers
```

## License

MIT
