import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-serif font-bold tracking-tight mb-2 italic">Slate</h1>
                    <p className="text-muted-foreground font-sans uppercase tracking-widest text-xs">The editorial engine</p>
                </div>
                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm normal-case",
                            card: "shadow-xl border-none",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                            footerActionLink: "text-primary hover:text-primary/90 font-medium",
                        }
                    }}
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    fallbackRedirectUrl="/dashboard"
                />
            </div>
        </div>
    );
}
