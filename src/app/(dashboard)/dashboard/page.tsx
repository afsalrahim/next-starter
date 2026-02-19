import { requireAuth } from "@/lib/auth";
import { DashboardView } from "./dashboard-view";

export default async function DashboardPage() {
    await requireAuth();

    return <DashboardView />;
}
