"use server";

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { syncUser } from "@/db/queries/users";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

/**
 * Onboarding server action
 * - Syncs Clerk user data to our postgres database
 * - Sets onboardingComplete flag in Clerk metadata
 */
export async function completeOnboarding() {
    try {
        const user = await currentUser();

        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        // 1. Sync to our database
        const syncResult = await syncUser({
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
            avatar: user.imageUrl,
            updatedAt: new Date(),
        });

        if (!syncResult.success) {
            throw new Error("Failed to sync user to database");
        }

        // 2. Update Clerk metadata
        const client = await clerkClient();
        await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
                onboardingComplete: true,
                dbSynced: true,
            },
        });

        logger.info("Onboarding completed successfully", { userId: user.id });

        // 3. Revalidate path to update UI state
        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        logger.error("Error during onboarding completion", error);
        return { success: false, error: "Internal server error" };
    }
}
