import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getTopTenUsers, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { FeedWrapper } from "@/components/feed-wrapper";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LeaderboardDate } from "@/components/leaderboard-date";

const LeaderboardPage = async () => {
    const userProgressData = getUserProgress();
    const topTenUsersData = getTopTenUsers();

    const [userProgress, topTenUsers] = await Promise.all([
        userProgressData,
        topTenUsersData,
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={false}
                    lastHeartAt={userProgress.lastHeartAt}
                />
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image src="/leaderboard.svg" alt="Leaderboard" height={90} width={90} />
                    <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                        Leaderboard
                    </h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        See where you stand among other learners in the community.
                    </p>
                    <LeaderboardDate />
                    <hr className="mb-4 h-0.5 w-full bg-gray-200 border-none rounded-full" />
                    {topTenUsers.map((user, index) => (
                        <div 
                            key={user.userId} 
                            className={cn(
                                "flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50",
                                user.userId === userProgress.userId && "bg-gray-200/50"
                            )}
                        >
                            <p className="font-bold text-lime-700 mr-4">{index + 1}</p>
                            <div className="relative h-12 w-12 ml-3 mr-6">
                                <Image
                                    src={user.userImageSrc}
                                    alt={user.userName}
                                    fill
                                    unoptimized
                                    className="object-cover rounded-full border bg-green-500"
                                />
                            </div>
                            <p className="font-bold text-neutral-800 flex-1">
                                {user.userName} {user.userId === userProgress.userId && " (You)"}
                            </p>
                            <p className="text-muted-foreground">
                                {user.points} XP
                            </p>
                        </div>
                    ))}
                </div>
            </FeedWrapper>
        </div>
    );
};

export default LeaderboardPage;
