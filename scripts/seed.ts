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
      // Lesson 3 - Adjectives
      { id: 8, lessonId: 3, type: "SELECT", order: 1, question: 'Which one of these is "the big house"?' },
      { id: 9, lessonId: 3, type: "ASSIST", order: 2, question: "the big house" },
      // Lesson 4 - Pronouns
      { id: 10, lessonId: 4, type: "SELECT", order: 1, question: 'Which one of these is "Yo"?' },
      { id: 11, lessonId: 4, type: "ASSIST", order: 2, question: "I, You, He" },
      // Lesson 5 - Prepositions
      { id: 12, lessonId: 5, type: "SELECT", order: 1, question: 'Which one of these is "in"?' },
      { id: 13, lessonId: 5, type: "ASSIST", order: 2, question: "in, on, under" },
      // Lesson 6 - Greetings
      { id: 6, lessonId: 6, type: "SELECT", order: 1, question: 'Which one of these is "Hello"?' },
      { id: 7, lessonId: 6, type: "ASSIST", order: 2, question: "Goodbye" },
      // Lesson 7 - Numbers
      { id: 14, lessonId: 7, type: "SELECT", order: 1, question: 'Which one of these is "Uno"?' },
      { id: 15, lessonId: 7, type: "ASSIST", order: 2, question: "one, two, three" },
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
      { id: 10, challengeId: 4, text: "Yo como", correct: true, audioSrc: "/es_yo_como.mp3" },
      { id: 11, challengeId: 4, text: "Él come", correct: false, audioSrc: "/es_el_come.mp3" },
      { id: 12, challengeId: 4, text: "Tú comes", correct: false, audioSrc: "/es_tu_comes.mp3" },
      // Challenge 5 (He eats)
      { id: 13, challengeId: 5, text: "Él come", correct: true, audioSrc: "/es_el_come.mp3" },
      { id: 14, challengeId: 5, text: "Yo como", correct: false, audioSrc: "/es_yo_como.mp3" },
      { id: 15, challengeId: 5, text: "Tú comes", correct: false, audioSrc: "/es_tu_comes.mp3" },
      // Challenge 8 (the big house)
      { id: 22, challengeId: 8, text: "La casa grande", correct: true, audioSrc: "/es_casa_grande.mp3" },
      { id: 23, challengeId: 8, text: "La casa pequeña", correct: false, audioSrc: "/es_casa_pequena.mp3" },
      { id: 24, challengeId: 8, text: "El perro grande", correct: false, audioSrc: "/es_perro_grande.mp3" },
      // Challenge 9 (the big house - assist)
      { id: 25, challengeId: 9, text: "La casa grande", correct: true, audioSrc: "/es_casa_grande.mp3" },
      { id: 26, challengeId: 9, text: "El gato azul", correct: false, audioSrc: "/es_gato_azul.mp3" },
      // Challenge 10 (Yo)
      { id: 27, challengeId: 10, text: "Yo", correct: true, audioSrc: "/es_yo.mp3" },
      { id: 28, challengeId: 10, text: "Nosotros", correct: false, audioSrc: "/es_nosotros.mp3" },
      // Challenge 11 (I, You, He)
      { id: 29, challengeId: 11, text: "Yo, Tú, Él", correct: true, audioSrc: null },
      { id: 30, challengeId: 11, text: "Ellos, Ellas", correct: false, audioSrc: null },
      // Challenge 12 (in)
      { id: 31, challengeId: 12, text: "En", correct: true, audioSrc: null },
      { id: 32, challengeId: 12, text: "Por", correct: false, audioSrc: null },
      // Challenge 13 (in, on, under)
      { id: 33, challengeId: 13, text: "En, Sobre, Debajo", correct: true, audioSrc: null },
      { id: 34, challengeId: 13, text: "Arriba, Abajo", correct: false, audioSrc: null },
      // Challenge 6 (Hello)
      { id: 16, challengeId: 6, text: "Hola", correct: true, audioSrc: null },
      { id: 17, challengeId: 6, text: "Adiós", correct: false, audioSrc: "/es_adios.mp3" },
      { id: 18, challengeId: 6, text: "Gracias", correct: false, audioSrc: "/es_gracias.mp3" },
      // Challenge 7 (Goodbye)
      { id: 19, challengeId: 7, text: "Adiós", correct: true, audioSrc: "/es_adios.mp3" },
      { id: 20, challengeId: 7, text: "Hola", correct: false, audioSrc: null },
      { id: 21, challengeId: 7, text: "Gracias", correct: false, audioSrc: "/es_gracias.mp3" },
      // Challenge 14 (Uno)
      { id: 35, challengeId: 14, text: "Uno", correct: true, audioSrc: "/es_uno.mp3" },
      { id: 36, challengeId: 14, text: "Diez", correct: false, audioSrc: "/es_diez.mp3" },
      // Challenge 15 (one, two, three)
      { id: 37, challengeId: 15, text: "Uno, Dos, Tres", correct: true, audioSrc: "/es_numbers_1.mp3" },
      { id: 38, challengeId: 15, text: "Cuatro, Cinco", correct: false, audioSrc: "/es_numbers_2.mp3" },
    ]);

    console.log("Seeding finished successfully!");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();
