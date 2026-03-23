import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";
import { InfinityIcon, X } from "lucide-react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
  lastHeartAt: Date | null | undefined;
};

const REGENERATION_INTERVAL = 20 * 60 * 1000;

export const Header = ({
  hearts,
  percentage,
  hasActiveSubscription,
  lastHeartAt,
}: Props) => {
  const { open } = useExitModal();
  const router = useRouter();
  const [countdown, setCountdown] = useState("");

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
    <header className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
      <X
        onClick={open}
        className="text-slate-500 hover:opacity-75 transition cursor-pointer"
      />
      <Progress value={percentage} />
      <Popover>
        <PopoverTrigger asChild>
          <div className="text-rose-500 flex items-center font-bold cursor-pointer hover:opacity-75 transition">
            <Image
              src="/heart.svg"
              alt="Heart"
              className="mr-2"
              width={28}
              height={28}
            />
            {hasActiveSubscription ? (
              <InfinityIcon className="stroke-[3] w-6 h-6" />
            ) : (
              hearts
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80" side="bottom">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-3">
              <Image src="/heart.svg" height={40} width={40} alt="Heart" />
              <div>
                <p className="font-bold text-lg">
                  {hearts >= 5 ? "Hearts are full!" : "Regenerating..."}
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
    </header>
  );
};
