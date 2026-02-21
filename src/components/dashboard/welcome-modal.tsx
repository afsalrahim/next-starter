"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "@/actions/onboarding.actions";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";
import { PUBLIC_CONFIG } from "@/config/public.config";

interface WelcomeModalProps {
    isOpen: boolean;
}

export function WelcomeModal({ isOpen }: WelcomeModalProps) {
    const [isPending, setIsPending] = React.useState(false);
    const router = useRouter();

    const handleComplete = async () => {
        setIsPending(true);
        try {
            const result = await completeOnboarding();

            if (result.success) {
                toast.success("Welcome aboard! Your profile is now ready.");
                router.refresh();
            } else {
                toast.error(result.error || "Something went wrong. Please try again.");
            }
        } catch (_error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-2xl">Welcome to ${PUBLIC_CONFIG.siteName}!</DialogTitle>
                    <DialogDescription className="text-center text-base">
                        We&apos;re excited to have you here. Let&apos;s get your profile synchronized and set up your workspace.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6 text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                        By clicking the button below, we will synchronize your account details with our system to enable all CMS features.
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleComplete}
                        className="w-full"
                        disabled={isPending}
                        size="lg"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Setting things up...
                            </>
                        ) : (
                            "Complete Setup"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
