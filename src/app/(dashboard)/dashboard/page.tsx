import { auth } from "@clerk/nextjs/server";
import { requireAuth } from "@/lib/auth";
import { DashboardView } from "./dashboard-view";

export default async function DashboardPage() {
    await requireAuth();
    const { sessionClaims } = await auth();

    // Check if onboarding is complete from Clerk metadata
    const onboardingComplete = sessionClaims?.metadata?.onboardingComplete === true;

    return <DashboardView onboardingComplete={onboardingComplete} />;
}
