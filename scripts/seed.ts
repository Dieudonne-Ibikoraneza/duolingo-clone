import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding the database...");
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);

    await db.insert(schema.courses).values([
      { id: 1, title: "Spanish", imageSrc: "/es.svg" },
      { id: 2, title: "Italian", imageSrc: "/it.svg" },
      { id: 3, title: "French", imageSrc: "/fr.svg" },
      { id: 4, title: "Croatian", imageSrc: "/hr.svg" },
    ]);

    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1, // Spanish
        title: "Unit 1",
        description: "Learn the basics of Spanish",
        order: 1,
      },
      {
        id: 2,
        courseId: 1, // Spanish
        title: "Unit 2",
        description: "Intermediate phrases",
        order: 2,
      },
    ]);

    await db.insert(schema.lessons).values([
      { id: 1, unitId: 1, title: "Nouns", order: 1 },
      { id: 2, unitId: 1, title: "Verbs", order: 2 },
      { id: 3, unitId: 1, title: "Adjectives", order: 3 },
      { id: 4, unitId: 1, title: "Pronouns", order: 4 },
      { id: 5, unitId: 1, title: "Prepositions", order: 5 },
      { id: 6, unitId: 2, title: "Greetings", order: 1 },
      { id: 7, unitId: 2, title: "Numbers", order: 2 },
    ]);

    await db.insert(schema.challenges).values([
      // Lesson 1 - Nouns
      { id: 1, lessonId: 1, type: "SELECT", order: 1, question: 'Which one of these is "the man"?' },
      { id: 2, lessonId: 1, type: "SELECT", order: 2, question: 'Which one of these is "the woman"?' },
      { id: 3, lessonId: 1, type: "ASSIST", order: 3, question: "the man" },
      // Lesson 2 - Verbs
      { id: 4, lessonId: 2, type: "SELECT", order: 1, question: 'Which one of these is "I eat"?' },
      { id: 5, lessonId: 2, type: "ASSIST", order: 2, question: "He eats" },
      // Lesson 6 - Greetings
      { id: 6, lessonId: 6, type: "SELECT", order: 1, question: 'Which one of these is "Hello"?' },
      { id: 7, lessonId: 6, type: "ASSIST", order: 2, question: "Goodbye" },
    ]);

    await db.insert(schema.challengeOptions).values([
      // Challenge 1 (the man)
      { id: 1, challengeId: 1, imageSrc: "/man.png", text: "el hombre", correct: true, audioSrc: "/es_man.mp3" },
      { id: 2, challengeId: 1, imageSrc: "/woman.png", text: "la mujer", correct: false, audioSrc: "/es_woman.mp3" },
      { id: 3, challengeId: 1, imageSrc: "/robot.png", text: "el robot", correct: false, audioSrc: "/es_robot.mp3" },
      // Challenge 2 (the woman)
      { id: 4, challengeId: 2, imageSrc: "/woman.png", text: "la mujer", correct: true, audioSrc: "/es_woman.mp3" },
      { id: 5, challengeId: 2, imageSrc: "/man.png", text: "el hombre", correct: false, audioSrc: "/es_man.mp3" },
      { id: 6, challengeId: 2, imageSrc: "/robot.png", text: "el robot", correct: false, audioSrc: "/es_robot.mp3" },
      // Challenge 3 (the man)
      { id: 7, challengeId: 3, text: "el hombre", correct: true, audioSrc: "/es_man.mp3" },
      { id: 8, challengeId: 3, text: "la mujer", correct: false, audioSrc: "/es_woman.mp3" },
      { id: 9, challengeId: 3, text: "el robot", correct: false, audioSrc: "/es_robot.mp3" },
      // Challenge 4 (I eat)
      { id: 10, challengeId: 4, text: "Yo como", correct: true },
      { id: 11, challengeId: 4, text: "Él come", correct: false },
      { id: 12, challengeId: 4, text: "Tú comes", correct: false },
      // Challenge 5 (He eats)
      { id: 13, challengeId: 5, text: "Él come", correct: true },
      { id: 14, challengeId: 5, text: "Yo como", correct: false },
      { id: 15, challengeId: 5, text: "Tú comes", correct: false },
      // Challenge 6 (Hello)
      { id: 16, challengeId: 6, text: "Hola", correct: true },
      { id: 17, challengeId: 6, text: "Adiós", correct: false },
      { id: 18, challengeId: 6, text: "Gracias", correct: false },
      // Challenge 7 (Goodbye)
      { id: 19, challengeId: 7, text: "Adiós", correct: true },
      { id: 20, challengeId: 7, text: "Hola", correct: false },
      { id: 21, challengeId: 7, text: "Gracias", correct: false },
    ]);

    console.log("Seeding finished successfully!");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();
