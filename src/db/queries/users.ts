import { db } from "@/db";
import { users, type NewUser } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

/**
 * Sync Clerk user to local database
 * used by webhooks to keep users table in sync
 */
export async function syncUser(data: NewUser) {
    try {
        const existing = await db
            .select()
            .from(users)
            .where(eq(users.id, data.id))
            .limit(1);

        if (existing.length > 0) {
            // Update existing user
            await db
                .update(users)
                .set({
                    email: data.email,
                    name: data.name,
                    avatar: data.avatar,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, data.id));

            logger.info("User updated from sync", { id: data.id });
        } else {
            // Create new user
            await db.insert(users).values(data);
            logger.info("User created from sync", { id: data.id });
        }

        return { success: true };
    } catch (error) {
        logger.error("Error syncing user", error);
        return { success: false, error };
    }
}

/**
 * Delete user from local database
 */
export async function deleteUser(id: string) {
    try {
        await db.delete(users).where(eq(users.id, id));
        logger.info("User deleted from sync", { id });
        return { success: true };
    } catch (error) {
        logger.error("Error deleting user", error);
        return { success: false, error };
    }
}