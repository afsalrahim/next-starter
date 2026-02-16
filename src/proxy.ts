import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
    "/admin(.*)",
    "/dashboard(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    // 1. Protect specific routes
    if (isProtectedRoute(req)) {
        await auth.protect();
    }

    // 2. Handle admin route authorization
    if (isAdminRoute(req)) {
        const { sessionClaims } = await auth();
        const role = sessionClaims?.metadata?.role;

        if (role !== "admin") {
            // Redirect non-admins to dashboard
            const dashboardUrl = new URL("/dashboard", req.url);
            return NextResponse.redirect(dashboardUrl);
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
