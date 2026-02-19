export function AdminView() {
    return (
        <div className="flex min-h-screen items-center justify-center p-8">
            <div className="max-w-2xl w-full space-y-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                    Welcome to the admin area. This is a placeholder for your administrative tools and settings.
                </p>
                <div className="pt-6">
                    <div className="p-12 border-2 border-dashed border-border rounded-xl">
                        <span className="text-sm font-medium text-muted-foreground">Admin Content Placeholder</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
