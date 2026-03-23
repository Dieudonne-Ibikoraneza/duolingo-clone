import { cache } from "react";
import db from "@/db/drizzle";
import { asc, desc, eq } from "drizzle-orm";


import {
  challengeProgress,
  courses,
  lessons,
  units,
  userProgress,
} from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  if (!data) return null;

  // Heart regeneration logic
  if (data.hearts < 5 && data.lastHeartAt) {
    const twentyMinutes = 20 * 60 * 1000;
    const elapsed = Date.now() - new Date(data.lastHeartAt).getTime();
    const regeneratedHearts = Math.floor(elapsed / twentyMinutes);

    if (regeneratedHearts > 0) {
      const newHearts = Math.min(5, data.hearts + regeneratedHearts);
      const newLastHeartAt = newHearts === 5 
        ? null 
        : new Date(new Date(data.lastHeartAt).getTime() + regeneratedHearts * twentyMinutes);

      await db.update(userProgress).set({
        hearts: newHearts,
        lastHeartAt: newLastHeartAt,
      }).where(eq(userProgress.userId, userId));

      return {
        ...data,
        hearts: newHearts,
        lastHeartAt: newLastHeartAt,
      };
    }
  }

  return data;
});

export const getUnits = cache(async () => {
  const { userId } = await auth();

  const userProgress = await getUserProgress();
  if (!userId || !userProgress?.activeCourseId) return [];

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {

      if(lesson.challenges.length === 0) return { ...lesson, completed: false };

      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });

      return { ...lesson, completed: allCompletedChallenges };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany({
    orderBy: [asc(courses.id)],
  });

  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });

  return data;
});

export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) return null;
  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some(
            (progress) => progress.completed === false
          )
        );
      });
    });

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  };
});

export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();
  if (!userId) return null;
  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;
  if (!lessonId) return null;

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) return null;

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed);

    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges };
});

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress || !courseProgress?.activeLessonId) return 0;

  const lesson = await getLesson(courseProgress.activeLessonId);
  if (!lesson) return 0;

  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed
  );

  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100
  );

  return percentage;
});

export const getTopTenUsers = cache(async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const data = await db.query.userProgress.findMany({
    orderBy: [desc(userProgress.points)],
    limit: 10,
    columns: {
        userId: true,
        userName: true,
        userImageSrc: true,
        points: true,
    }
  });

  return data;
});
