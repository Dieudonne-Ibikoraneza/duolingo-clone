"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { InfinityIcon } from "lucide-react";
import { courses } from "@/db/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
  lastHeartAt: Date | null | undefined;
};

const REGENERATION_INTERVAL = 20 * 60 * 1000;

export const UserProgress = ({
  activeCourse,
  points,
  hearts,
  hasActiveSubscription,
  lastHeartAt,
}: Props) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState("");
  const [animateHearts, setAnimateHearts] = useState(false);
  const prevHeartsRef = useRef(hearts);

  useEffect(() => {
    if (hearts > prevHeartsRef.current) {
        setAnimateHearts(true);
        setTimeout(() => setAnimateHearts(false), 500);
    }
    prevHeartsRef.current = hearts;
  }, [hearts]);

  useEffect(() => {
    if (hearts >= 5 || !lastHeartAt || hasActiveSubscription) {
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
  }, [hearts, lastHeartAt, hasActiveSubscription, router]);

  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <Link href="/courses">
        <Button variant="ghost">
          <Image
            src={activeCourse.imageSrc}
            alt={activeCourse.title}
            className="rounded-md border"
            width={32}
            height={32}
          />
        </Button>
      </Link>
      <Link href="/shop">
        <Button variant="ghost" className="text-orange-500">
          <Image
            src="/points.svg"
            height={28}
            width={28}
            alt="Points"
            className="mr-2"
          />
          {points}
        </Button>
      </Link>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className={cn(
            "text-rose-500",
            animateHearts && "animate-heart-boost"
          )}>
            <Image
              src="/heart.svg"
              height={22}
              width={22}
              alt="Hearts"
              className="mr-2"
            />
            {hasActiveSubscription ? (
              <InfinityIcon className="h-4 w-4 stroke-[3]" />
            ) : (
              hearts
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" side="bottom">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-3">
              <Image src="/heart.svg" height={40} width={40} alt="Heart" />
              <div>
                <p className="font-bold text-lg">
                  {hearts >= 5 ? "Hearts are full!" : "Replenishing hearts"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {hearts >= 5 
                    ? "Keep up the great work! You have all your hearts."
                    : `Next heart in ${countdown || "20:00"}`
                  }
                </p>
              </div>
            </div>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/shop">
                {hearts >= 5 ? "Go to shop" : "Get more hearts"}
              </Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
