"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { refillHearts } from "@/actions/user-progress";
import { toast } from "sonner";
import { InfinityIcon } from "lucide-react";

type Props = {
    hearts: number;
    points: number;
    hasActiveSubscription: boolean;
};

export const Items = ({ hearts, points, hasActiveSubscription }: Props) => {
    const [pending, startTransition] = useTransition();

    const onRefillHearts = () => {
        if (pending || hearts === 5 || points < 50) return;

        startTransition(() => {
            refillHearts()
                .catch(() => toast.error("Something went wrong"));
        });
    };

    return (
        <ul className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Image src="/heart.svg" alt="Heart" height={60} width={60} />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Refill hearts
                    </p>
                </div>
                <Button
                    onClick={onRefillHearts}
                    disabled={pending || hearts === 5 || points < 50}
                >
                    {hearts === 5 ? (
                        "full"
                    ) : (
                        <div className="flex items-center">
                            <Image src="/points.svg" alt="Points" height={20} width={20} />
                            <p className="ml-2">50</p>
                        </div>
                    )}
                </Button>
            </div>
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <InfinityIcon className="h-10 w-10 text-rose-500" />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Unlimited hearts
                    </p>
                </div>
                <Button disabled={pending}>
                    {hasActiveSubscription ? "active" : "coming soon"}
                </Button>
            </div>
        </ul>
    );
};
