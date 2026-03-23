import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
    value: number;
    variant: "points" | "hearts";
};

export const ResultCard = ({ value, variant }: Props) => {
    const imageSrc = variant === "points" ? "/points.svg" : "/heart.svg";

    return (
        <div className={cn(
            "rounded-2xl border-2 w-full p-4",
            variant === "points" && "bg-orange-400 border-orange-400",
            variant === "hearts" && "bg-rose-500 border-rose-500"
        )}>
            <div className={cn(
                "p-1.5 text-white uppercase font-bold text-xs rounded-t-xl text-center",
                variant === "points" && "bg-orange-400",
                variant === "hearts" && "bg-rose-500"
            )}>
                {variant === "points" ? "Total XP" : "Hearts Left"}
            </div>
            <div className="rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg">
                <Image
                    alt="Icon"
                    src={imageSrc}
                    height={30}
                    width={30}
                    className="mr-1.5"
                />
                {value}
            </div>
        </div>
    );
};
