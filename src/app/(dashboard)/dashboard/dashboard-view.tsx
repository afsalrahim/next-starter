export function DashboardView() {
    return (
        <div className="flex min-h-screen items-center justify-center p-8">
            <div className="max-w-2xl w-full space-y-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">User Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                    Welcome back! This is your personal dashboard placeholder.
                </p>
                <div className="pt-6">
                    <div className="p-12 bg-muted/50 border border-border rounded-xl">
                        <span className="text-sm font-medium text-muted-foreground">Dashboard Content Placeholder</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
