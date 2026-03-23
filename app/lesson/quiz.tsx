"use client";

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription: any;
  lastHeartAt: Date | null | undefined;
};

import { challengeOptions, challenges } from "@/db/schema";
import { useHeartsModal } from "@/store/use-hearts-modal";
import React, { useState, useTransition, useEffect } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";
import confetti from "canvas-confetti";
import { ResultCard } from "./result-card";

const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
  lastHeartAt,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [challenges, setChallenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
  const [animateHearts, setAnimateHearts] = useState(false);

  useEffect(() => {
    if (initialHearts > hearts) {
        setAnimateHearts(true);
        setTimeout(() => setAnimateHearts(false), 500);
    }
    setHearts(initialHearts);
  }, [initialHearts]);

  const [selectedOption, setSelectedOption] = useState<number>();

  const onSelect = (id: number) => {
    if (status !== "none") return;

    setSelectedOption(id);
  };

  const [pending, startTransition] = useTransition();

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (!correctOption) {
      return;
    }

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal(lastHeartAt);
              return;
            }

            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            // This is a client side update to happen immediately
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal(lastHeartAt);
              return;
            }

            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    }
  };

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions || [];

  useEffect(() => {
    if (!challenge) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
  }, [challenge]);

  if (!challenge) {
    return (
      <>
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
            <NextImage
                src="/mascot.svg"
                alt="Finish"
                className="hidden lg:block"
                height={100}
                width={100}
            />
            <NextImage
                src="/mascot.svg"
                alt="Finish"
                className="block lg:hidden"
                height={50}
                width={50}
            />
            <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                Great job! <br /> You've completed the lesson.
            </h1>
            <div className="flex items-center gap-x-4 w-full">
                <ResultCard
                    variant="points"
                    value={challenges.length * 10}
                />
                <ResultCard
                    variant="hearts"
                    value={hearts}
                />
            </div>
        </div>
        <Footer
            lessonId={initialLessonId}
            status="completed"
            onCheck={() => window.location.href = "/learn"}
        />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
        lastHeartAt={lastHeartAt}
        animateHearts={animateHearts}
      />
      <div className="flex-1">
        <div className="flex items-center h-full justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};

export default Quiz;
