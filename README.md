# 🚀 NextJS Starter Template

Production-ready Next.js starter with TypeScript, shadcn/ui, Drizzle ORM, and Clerk authentication.

## ✨ Features

- ✅ Next.js 15+ with App Router
- ✅ TypeScript
- ✅ shadcn/ui (all components pre-installed)
- ✅ Drizzle ORM + PostgreSQL
- ✅ Clerk Authentication
- ✅ Protected Routes with Role-based Access
- ✅ Automated Setup Script

## 🎯 Quick Start
```bash
# Clone starter
git clone <your-starter-repo> my-new-project
cd my-new-project

# Run setup script
./setup-new-project.sh

# Follow prompts and you're done!
```

## 🔧 Environment Setup

Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/project_db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard/dashboard
```

## 💾 Database
```bash
# Generate and apply migrations
npx drizzle-kit generate
npx drizzle-kit push

# View database
npx drizzle-kit studio
```

## 📁 Project Structure
```
src/app/
├── (auth)/
│   ├── sign-in/
│   └── sign-up/
├── (dashboard)/
│   └── dashboard/
├── (admin)/
│   └── admin/
├── components/
├── db/
│   ├── index.ts
│   └── schema.ts
└── middleware.ts
```

## 🔐 Protected Routes

- `/auth/sign-in` - Sign in (public)
- `/auth/sign-up` - Sign up (public)
- `/dashboard/dashboard` - Protected (logged-in users)
- `/admin/admin` - Protected (admin only)

## 📦 Scripts
```bash
npm run dev       # Development
npm run build     # Build
npm start         # Production
npm run lint      # Lint
```

## 💾 Database Example
```typescript
import { db } from "@/db";
import { users } from "@/db/schema";

// Get all users
const allUsers = await db.select().from(users);

// Insert user
await db.insert(users).values({ name: "John" });
```

## 📚 Tech Stack

- Next.js 15+ | TypeScript | shadcn/ui
- Tailwind CSS | Drizzle ORM | PostgreSQL | Clerk

## 🔗 Resources

- [Next.js](https://nextjs.org/docs)
- [Drizzle](https://orm.drizzle.team/)
- [Clerk](https://clerk.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

**Happy coding! 🎉**