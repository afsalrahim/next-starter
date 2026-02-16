---
trigger: always_on
---

# Coding and Development Standards (Next.js 16+)

## 1. Core Architecture & Rendering

* **TypeScript First:** Strict Type Safety is mandatory. **NEVER** use the `any` keyword. All function arguments, return types, and variables must be explicitly typed. If a type is unknown, use `unknown` and narrow it.
* **Server Components by Default:** All components, including `layout.tsx` and `page.tsx`, should be Server Components. Do not add `"use client"` to layouts or pages.
* **Client Components:** Use `"use client"` only in dedicated child components for hooks, interactivity, or browser-only logic. Prioritize client-only child components over making a parent a Client Component.
* **Rendering Strategy:** Default to **Static Site Generation (SSG)**.
* **SEO:** Use the Next.js Metadata API at the page level.

---

## 2. Project Structure & Routing Hierarchy

Follow this directory map within `src/`:

### Data & Database

* **Schema:** All database tables and relations in `src/db/schema.ts`.
* **Queries:** Table-specific interactions in `src/db/queries/[table-name].ts`.
* **Joins:** Multi-table join queries in `src/db/queries/joins.ts`.
* **ORM/DB:** Use **Drizzle ORM** with **PostgresDB**.

### Server Actions

* **Naming:** `[table-name].actions.ts` in `src/actions/`.
* **Standard Response:** Always return `{ success: true; data?: T } | { success: false; error?: string }`.

### Routing & Colocation (Route Groups)

* **Categorization:** All routes must stay under a parent Route Group (e.g., `(dashboard)`).
* **Group Layouts:** Use `layout.tsx` at the Route Group level.
* **Shared Group Components:** Use a private `_components/` folder **ONLY** at the first level of a Route Group.
* **View Pattern:** `page.tsx` (Controller/Data) must render a `{page-name}-view.tsx` (UI) in the same folder.

---

## 3. UI Standards & Styling (Shadcn + OKLCH Theme)

* **Strict Theming:** **NEVER** use hardcoded Tailwind color scales (e.g., `text-blue-500`). Use semantic utility classes from `global.css`.
* **Component Integrity:** **NEVER** modify files inside `src/components/ui/`. Wrap them in `src/components/ui-custom/` if extensions are needed.
* **No Native Elements:** **NEVER** use native browser dialogs (`alert`) or raw HTML tags (`<select>`) where a Shadcn equivalent exists.

### Semantic Color Enforcement

* **Surface:** `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `bg-secondary`.
* **Typography:** `text-foreground`, `text-muted-foreground`, `text-primary-foreground`.
* **Actions:** `bg-primary`, `bg-accent`, `bg-destructive`.
* **Borders/UI:** `border-border`, `border-input`, `ring-ring`.

---

## 4. Forms & Validation (Shadcn Standard)

* **Hierarchy:** `<Form>` → `<FormField>` → `<FormItem>` → `<FormControl>` → `<FormMessage>`.
* **Hook:** Use `useForm` with `zodResolver` and `defaultValues`.
* **Feedback:** Use Shadcn **Sonner** (global tasks) or **Toast** (critical alerts).

---

## 5. Authentication & Security

* **Logic:** All auth functions reside in `src/lib/auth.ts`.
* **Protection:** Use **`src/proxy.ts`** (formerly `middleware.ts`) for route protection, session redirects, and request intercepting.
* **Zero Trust:** Re-validate permissions inside every Server Action.
* **Validation:** Use **Zod** for all Server Action inputs.

---

## 6. Utilities & Configuration

* **`src/proxy.ts`:** Handles edge-level logic, auth guards, and routing redirects.
* **`src/config/public.config.ts`:** Non-sensitive constants for client/server.
* **`src/config/server.config.ts`:** Protected, server-only secrets.
* **Logging:** Use `src/lib/logger.ts` for all server-side logging.
* **Images:** Use `next/image` with dimensions and `priority` for LCP.

---

## 7. Error Handling

* **Graceful Catch:** Catch all database/runtime errors in actions and return a clean error string to the UI.

### Implementation Sample (Directory Visual)

```text
src/
├── proxy.ts                    <-- Replaces middleware.ts
├── actions/
│   └── funds.actions.ts        <-- Table-specific actions
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx          <-- Group Layout
│   │   ├── _components/        <-- Shared Dashboard components
│   │   └── dashboard/
│   │       └── funds/
│   │           ├── page.tsx    <-- Controller
│   │           └── funds-view.tsx
│   └── (auth)/
│       ├── layout.tsx
│       └── sign-in/
│           ├── page.tsx
│           └── sign-in-view.tsx
└── db/
    ├── schema.ts
    └── queries/

```

---