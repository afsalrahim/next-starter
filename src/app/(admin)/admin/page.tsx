import { requireAdmin } from "@/lib/auth";
import { AdminView } from "./admin-view";

export default async function AdminPage() {
    await requireAdmin();

    return <AdminView />;
}
