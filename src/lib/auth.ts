import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Require authentication for server components and server actions
 * Throws error if user is not authenticated
 */
export async function requireAuth() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    return userId;
}

/**
 * Get current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentAuthUser() {
    const user = await currentUser();
    return user;
}

/**
 * Check if the user has a specific role
 */
export async function hasRole(role: "admin" | "viewer" | "contributor"): Promise<boolean> {
    const user = await currentUser();
    if (!user) return false;

    const userRole = (user.publicMetadata?.role as string) || "viewer";
    return userRole === role;
}

/**
 * Check if current user is an admin
 * Returns true if user has admin role
 */
export async function isAdmin(): Promise<boolean> {
    return await hasRole("admin");
}

/**
 * Require admin role for server components and server actions
 * Redirects to dashboard if not admin
 */
export async function requireAdmin() {
    const admin = await isAdmin();

    if (!admin) {
        redirect('/dashboard');
    }
}

/**
 * Get user ID from Clerk auth
 * Returns null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
    const { userId } = await auth();
    return userId;
}
