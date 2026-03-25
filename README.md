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

- **Next.js 16** with App Router (Turbopack build)
- **TypeScript**
- **React 19**
- Custom NumPy JS engine (no external dependencies)
- localStorage for persistence
- Optional PostHog (`posthog-js`) for product analytics and client-side error tracking
- Deploys to Vercel with zero config

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Analytics & errors (PostHog)

Optional. Add to `.env.local` and in Vercel **Environment Variables**:

- `NEXT_PUBLIC_POSTHOG_TOKEN` — your PostHog **project** write token (from Project settings). If unset, analytics is disabled (no runtime errors). If PostHog shows separate tokens per **environment** inside the same project, use the token that matches each deploy (e.g. Development locally, Production on Vercel).
- `NEXT_PUBLIC_POSTHOG_DEBUG` — set to `1` in `.env.local` to enable verbose PostHog client logging in the browser console (remove when finished debugging).
- `NEXT_PUBLIC_POSTHOG_HOST` — optional; defaults to `https://us.i.posthog.com`. Use your region or reverse proxy URL if needed.
- `NEXT_PUBLIC_POSTHOG_ENV` — optional; forces the **`environment`** super property on events (`development`, `staging`, `preview`, or `production`). If unset, the app uses Vercel’s deploy type when available (`preview` for preview deploys), otherwise `NODE_ENV` (so local `next dev` is `development`).

**One project, multiple environments (recommended for NumPy Dojo)**

On the free plan you typically have **one PostHog project** with **multiple environments** (e.g. Development, Staging, Production). Use the environment switcher / filters in PostHog so insights only include the environment you care about.

This app sends an **`environment`** super property on every event (`development`, `preview`, or `production` by default, or `staging` if you set `NEXT_PUBLIC_POSTHOG_ENV=staging`). In PostHog, filter or break down by **`environment`** (for example `environment` = `production` for live users). That matches PostHog’s model without needing a second project.

**If localhost events don’t show in Activity**

1. Confirm the variable name is **`NEXT_PUBLIC_POSTHOG_TOKEN`** (must include the `NEXT_PUBLIC_` prefix). Restart **`yarn dev`** after changing `.env.local`.
2. In PostHog, check Activity / Live view filters — include **Development** (or “all environments”), not only Production; local traffic is tagged **`environment` = `development`**.
3. Disable ad blockers / tracking protection for `localhost` (they often block `*.posthog.com` / `*.i.posthog.com`).
4. In DevTools → **Network**, filter for `posthog` or `i.posthog` and confirm requests return **200** (not blocked or CORS errors).
5. Add `NEXT_PUBLIC_POSTHOG_DEBUG=1`, restart dev, open the browser console, and reload — you should see PostHog debug lines if the client initialized.

Product events stay anonymous until you add auth and identify users in PostHog. **Exception autocapture** is enabled for unhandled errors; route-level errors and user code run failures are also reported when the token is set.

**Server-side errors (`posthog-node`)**

The same **`NEXT_PUBLIC_POSTHOG_TOKEN`** is read on the Node server (optional override: **`POSTHOG_SERVER_TOKEN`** if you prefer a server-only secret later). Use **`captureServerException`** or **`captureServerExceptionAndFlush`** from `@/lib/posthog-server` inside **Route Handlers**, **Server Actions**, or `try/catch` around server-only code. **`captureServerExceptionAndFlush`** is safest on Vercel serverless so the event is flushed before the function returns.

`src/instrumentation.ts` registers **SIGTERM** / **SIGINT** handlers (via `posthog-shutdown-hooks`) to **shutdown** the PostHog client on Node process exit, and exports **`onRequestError`** so App Router renders, Route Handlers, and Server Actions that fail on the **Node** runtime are reported to PostHog with **`surface: onRequestError`** (see [Next.js instrumentation](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation)).

**Verify server error tracking (local):** add **`POSTHOG_SERVER_TEST=1`** to `.env.local`, restart **`yarn dev`**, open **`http://localhost:3000/api/posthog-server-test`**, then check PostHog **Error tracking** / **Activity** for an issue from distinct id **`$server`** with property **`surface` = `posthog_server_test`**. Remove **`POSTHOG_SERVER_TEST`** afterward. This route always returns **404** in production builds.

## Deploy to Vercel

Push to GitHub, import in [vercel.com/new](https://vercel.com/new), deploy. That's it.

Set `NEXT_PUBLIC_POSTHOG_TOKEN` (and optionally `NEXT_PUBLIC_POSTHOG_HOST`) in the Vercel project if you use PostHog. Use Vercel’s **Environment** dropdown for different values per Production / Preview / Development if you use per-environment PostHog tokens; otherwise one token plus filtering on **`environment`** in PostHog is enough.

## Project Structure

```
src/
├── app/
│   ├── globals.css      # All styles
│   ├── layout.tsx        # Root layout with fonts
│   └── page.tsx          # Main app with tabs
├── instrumentation.ts    # PostHog shutdown + onRequestError → PostHog
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
