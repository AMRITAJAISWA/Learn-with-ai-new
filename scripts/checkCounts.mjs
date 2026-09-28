import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const models = [
    'user',
    'studentProfile',
    'course',
    'module',
    'topic',
    'learningProgress',
    'quiz',
    'question',
    'quizAttempt',
    'flashcardSet',
    'flashcard',
    'revisionItem',
    'videoRecommendation',
    'studySession',
    'studySessionParticipant',
    'conversation',
    'conversationParticipant',
    'message',
    'learningGoal',
    'notification'
  ];

  console.log('\n--- Model Row Counts ---');
  for (const m of models) {
    try {
      const count = await prisma[m].count();
      console.log(`${m.padEnd(26)} : ${count} rows`);
    } catch (err) {
      console.error(`Error for ${m}:`, err.message);
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
