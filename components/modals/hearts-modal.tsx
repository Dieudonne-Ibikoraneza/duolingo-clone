"use client";

import { useHeartsModal } from "@/store/use-hearts-modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const REGENERATION_INTERVAL = 20 * 60 * 1000;

export const HeartsModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close, lastHeartAt } = useHeartsModal();
    const [countdown, setCountdown] = useState("");
  
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isOpen || !lastHeartAt) {
            setCountdown("");
            return;
        }

        const interval = setInterval(() => {
            const nextHeartAt = new Date(new Date(lastHeartAt).getTime() + REGENERATION_INTERVAL);
            const remaining = nextHeartAt.getTime() - Date.now();

            if (remaining <= 0) {
                setCountdown("");
                clearInterval(interval);
                router.refresh();
                return;
            }

            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            setCountdown(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen, lastHeartAt]);
  
    if (!isClient) return null;

    const onClick = () => {
        close();
        router.push("/shop");
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image src="/mascot_sad.svg" alt="mascot" height={80} width={80} />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        You&apos;re out of hearts!
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Get unlimited hearts to stay motivated.
                        {countdown && (
                            <span className="block mt-2 font-bold text-rose-500">
                                Next heart in: {countdown}
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full"
                            onClick={onClick}
                        >
                            Get unlimited hearts
                        </Button>
                        <Button
                            variant="ghost"
                            size="lg"
                            className="w-full"
                            onClick={close}
                        >
                            No thanks
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
