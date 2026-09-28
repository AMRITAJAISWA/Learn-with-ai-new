import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting full database seed for LearnWithAI...");

  // 1. Create or upsert primary user
  const user = await prisma.user.upsert({
    where: { email: "aarav.patel@stanford.edu" },
    update: {},
    create: {
      id: "user_demo_123",
      email: "aarav.patel@stanford.edu",
      name: "Aarav Patel",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav",
      profile: {
        create: {
          educationLevel: "Undergraduate (Computer Science)",
          college: "Stanford University",
          targetSubjects: ["Data Science", "Algorithms", "Machine Learning", "Python"],
          skillLevel: "Intermediate",
          learningGoals: "Prepare for Top-Tier AI & Machine Learning Engineering Roles",
          preferredStudyDuration: 60,
          preferredStudyTime: "Evening",
          interests: ["Neural Networks", "System Design", "Python", "Full-Stack AI"],
          streakDays: 7,
          totalXP: 1250,
          bio: "CS sophomore passionate about neural networks, distributed systems, and building AI tools.",
          isDiscoverable: true,
        },
      },
    },
  });

  // Secondary peer user for collaboration
  const peerUser = await prisma.user.upsert({
    where: { email: "amrita.jaiswal@iem.edu" },
    update: {},
    create: {
      id: "user_peer_456",
      email: "amrita.jaiswal@iem.edu",
      name: "Amrita Jaiswal",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Amrita",
      profile: {
        create: {
          educationLevel: "B.Tech Computer Science",
          college: "Institute of Engineering & Management",
          targetSubjects: ["Algorithms", "Web Development", "Java"],
          skillLevel: "Intermediate",
          learningGoals: "Master Full-Stack Engineering and Microservices",
          preferredStudyDuration: 90,
          preferredStudyTime: "Night",
          interests: ["Java", "Spring Boot", "React", "Distributed Caching"],
          streakDays: 12,
          totalXP: 1980,
          bio: "Full stack enthusiast, competitive programmer, and open-source contributor.",
          isDiscoverable: true,
        },
      },
    },
  });

  console.log("✅ Seeded Users & Student Profiles");

  // 2. Seed Courses, Modules & Topics
  // Course 1: Python for Data Science
  const course1 = await prisma.course.upsert({
    where: { id: "course_python_ds" },
    update: {},
    create: {
      id: "course_python_ds",
      userId: user.id,
      title: "Python for Data Science & Neural Computing",
      description:
        "Master Python from foundational structures to NumPy, Pandas, automated visualization, and real-world predictive modeling.",
      category: "Data Science & AI",
      skillLevel: "Beginner",
      estimatedHours: 24,
      targetOutcome: "End-to-End Predictive Analytics & Data Wrangling",
      completionPct: 64,
      isCompleted: false,
      learningSequence: [
        "Python Syntax & Core Objects",
        "Data Structures & Comprehensions",
        "Vectorized Math with NumPy",
        "Dataframe Engineering with Pandas",
      ],
      prerequisites: ["Basic logic and high school math"],
      modules: {
        create: [
          {
            id: "mod_py_1",
            order: 1,
            title: "Python Syntax & Core Primitives",
            description: "Variables, dynamic memory allocation, and execution runtime.",
            topics: {
              create: [
                {
                  id: "top_py_1_1",
                  order: 1,
                  title: "Foundations of Python: Variables & Memory Model",
                  summary: "Dynamic typing, reference counting, mutability rules, and namespace bindings in Python.",
                  estimatedMinutes: 30,
                  status: "COMPLETED",
                  keyTakeaways: ["Python objects vs primitive references", "Immutable vs mutable object behavior"],
                },
                {
                  id: "top_py_1_2",
                  order: 2,
                  title: "Core Operators, Type Casting & String Formatting",
                  summary: "Mathematical expressions, boolean logic short-circuiting, and idiomatic string interpolation.",
                  estimatedMinutes: 35,
                  status: "COMPLETED",
                  keyTakeaways: ["Short-circuit evaluation", "f-string formatting performance"],
                },
              ],
            },
          },
          {
            id: "mod_py_2",
            order: 2,
            title: "Data Structures & Comprehensions",
            description: "Lists, sets, dicts, hash table mechanics, and list comprehensions.",
            topics: {
              create: [
                {
                  id: "top_py_2_1",
                  order: 1,
                  title: "Lists, Tuples & Immutability Guarantees",
                  summary: "Contiguous array memory, dynamic resizing amortized analysis, and tuple hashing.",
                  estimatedMinutes: 40,
                  status: "IN_PROGRESS",
                  keyTakeaways: ["Amortized O(1) appending", "When to enforce tuple immutability"],
                },
                {
                  id: "top_py_2_2",
                  order: 2,
                  title: "Dictionaries & Sets: Hash Tables & O(1) Lookups",
                  summary: "Open addressing, collision resolution, hash buckets, and dictionary comprehension syntax.",
                  estimatedMinutes: 45,
                  status: "NOT_STARTED",
                  keyTakeaways: ["Constant time lookups", "Key hashing contract (__hash__ and __eq__)"],
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 2: Java Enterprise & OOP
  const course2 = await prisma.course.upsert({
    where: { id: "course_java_oop" },
    update: {},
    create: {
      id: "course_java_oop",
      userId: user.id,
      title: "Java Enterprise Architecture & Object-Oriented Principles",
      description:
        "Deep conceptual mastery of Java: JVM internals, memory management, OOP paradigms, and modular clean architecture.",
      category: "Computer Science & Engineering",
      skillLevel: "Intermediate",
      estimatedHours: 32,
      targetOutcome: "Production-grade Object-Oriented Architecture",
      completionPct: 35,
      isCompleted: false,
      learningSequence: [
        "JVM Architecture & Memory Allocation",
        "The Four Pillars of Object-Oriented Design",
        "Design Patterns & SOLID Principles",
      ],
      prerequisites: ["Fundamental programming syntax"],
      modules: {
        create: [
          {
            id: "mod_java_1",
            order: 1,
            title: "JVM Architecture & Memory Hierarchy",
            description: "Class loading, heap vs stack, garbage collection heuristics, and bytecode execution.",
            topics: {
              create: [
                {
                  id: "top_java_1_1",
                  order: 1,
                  title: "JVM Architecture, Classloaders & Execution Engine",
                  summary: "How source code compiles to bytecode (.class) and executes on the JVM runtime.",
                  estimatedMinutes: 40,
                  status: "COMPLETED",
                  keyTakeaways: ["Platform independence via bytecode", "Classloader hierarchy"],
                },
                {
                  id: "top_java_1_2",
                  order: 2,
                  title: "Memory Model: Stack Frames vs Heap Objects",
                  summary: "Primitive storage on the thread stack, object instantiation in the Eden/Tenured heap.",
                  estimatedMinutes: 45,
                  status: "IN_PROGRESS",
                  keyTakeaways: ["Pass-by-value of object references", "Generational garbage collection"],
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seeded Courses, Modules, and Topics");

  // 3. Learning Progress
  await prisma.learningProgress.upsert({
    where: {
      userId_topicId: {
        userId: user.id,
        topicId: "top_py_1_1",
      },
    },
    update: {},
    create: {
      userId: user.id,
      topicId: "top_py_1_1",
      status: "COMPLETED",
      timeSpentMin: 45,
    },
  });

  await prisma.learningProgress.upsert({
    where: {
      userId_topicId: {
        userId: user.id,
        topicId: "top_py_2_1",
      },
    },
    update: {},
    create: {
      userId: user.id,
      topicId: "top_py_2_1",
      status: "IN_PROGRESS",
      timeSpentMin: 25,
    },
  });

  // 4. Quizzes, Questions & Attempts
  const quiz1 = await prisma.quiz.upsert({
    where: { id: "quiz_py_ds_1" },
    update: {},
    create: {
      id: "quiz_py_ds_1",
      courseId: course1.id,
      title: "Python Data Structures & Hash Tables Diagnostic",
      topicTitle: "Lists, Dictionaries & Time Complexity",
      difficulty: "Intermediate",
      questions: {
        create: [
          {
            id: "q_py_1",
            questionText: "What is the average time complexity of looking up a key in a Python dictionary?",
            type: "MCQ",
            options: ["O(1) - Constant Time", "O(N) - Linear Time", "O(log N) - Logarithmic", "O(N log N)"],
            correctAnswer: "O(1) - Constant Time",
            explanation: "Python dictionaries use hash tables with pseudo-random probing, giving amortized O(1) lookup.",
          },
          {
            id: "q_py_2",
            questionText: "Which Python data type is immutable?",
            type: "MCQ",
            options: ["Tuple", "List", "Dictionary", "Set"],
            correctAnswer: "Tuple",
            explanation: "Tuples cannot be altered once created, ensuring hashable guarantees for dictionary keys.",
          },
        ],
      },
    },
  });

  await prisma.quizAttempt.upsert({
    where: { id: "attempt_1" },
    update: {},
    create: {
      id: "attempt_1",
      quizId: quiz1.id,
      userId: user.id,
      score: 2,
      totalQuestions: 2,
      accuracyPct: 100.0,
      timeSpentSec: 75,
      weakTopics: [],
      answers: { q_py_1: "O(1) - Constant Time", q_py_2: "Tuple" },
    },
  });

  console.log("✅ Seeded Quizzes, Questions & Attempts");

  // 5. FlashcardSets & Flashcards
  await prisma.flashcardSet.upsert({
    where: { id: "set_py_fundamentals" },
    update: {},
    create: {
      id: "set_py_fundamentals",
      userId: user.id,
      title: "Python Data Science Foundations",
      topic: "Python & NumPy Core Primitives",
      cards: {
        create: [
          {
            id: "card_py_1",
            front: "What is the difference between shallow copy and deep copy in Python?",
            back: "Shallow copy creates a new container but references child objects. Deep copy recursively duplicates all nested objects.",
            mastery: 4,
          },
          {
            id: "card_py_2",
            front: "How does NumPy achieve 10x-50x speedups over native Python loops?",
            back: "NumPy arrays are stored in contiguous C-level memory buffers with SIMD vectorized CPU execution, avoiding Python interpreter overhead.",
            mastery: 5,
          },
        ],
      },
    },
  });

  // 6. Revision Items
  await prisma.revisionItem.upsert({
    where: { id: "rev_item_1" },
    update: {},
    create: {
      id: "rev_item_1",
      userId: user.id,
      courseId: course1.id,
      topicTitle: "Lists, Tuples & Immutability Guarantees",
      nextRevisionAt: new Date(Date.now() + 24 * 3600 * 1000),
      intervalDays: 1,
      difficulty: "Medium",
      performance: 85,
      needsPractice: false,
    },
  });

  await prisma.revisionItem.upsert({
    where: { id: "rev_item_2" },
    update: {},
    create: {
      id: "rev_item_2",
      userId: user.id,
      courseId: course2.id,
      topicTitle: "Stack Frames vs Heap Objects in Java",
      nextRevisionAt: new Date(Date.now() + 48 * 3600 * 1000),
      intervalDays: 2,
      difficulty: "Hard",
      performance: 60,
      needsPractice: true,
    },
  });

  // 7. Video Recommendations
  await prisma.videoRecommendation.upsert({
    where: { id: "rec_vid_1" },
    update: {},
    create: {
      id: "rec_vid_1",
      courseId: course1.id,
      topicId: "top_py_1_1",
      youtubeId: "kqtD5dpn9C8",
      title: "Python for Beginners - Full Course [Programming Tutorial]",
      channel: "freeCodeCamp.org",
      thumbnailUrl: "https://img.youtube.com/vi/kqtD5dpn9C8/hqdefault.jpg",
      duration: "4:26:52",
      difficulty: "Beginner",
      aiReason: "Comprehensive ground-up walkthrough covering variables, memory models, and data structures.",
    },
  });

  // 8. Study Sessions & Participants
  const session1 = await prisma.studySession.upsert({
    where: { id: "session_1" },
    update: {},
    create: {
      id: "session_1",
      title: "Python Data Science & Algorithms Sprint",
      subject: "Data Science & AI",
      topic: "NumPy Vectorization & Dictionary Optimization",
      scheduledAt: new Date(Date.now() + 3 * 3600 * 1000),
      durationMin: 60,
      goal: "Implement 3 vectorized operations and review algorithmic complexities together.",
      isCompleted: false,
    },
  });

  await prisma.studySessionParticipant.upsert({
    where: {
      sessionId_userId: {
        sessionId: session1.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      sessionId: session1.id,
      userId: user.id,
    },
  });

  await prisma.studySessionParticipant.upsert({
    where: {
      sessionId_userId: {
        sessionId: session1.id,
        userId: peerUser.id,
      },
    },
    update: {},
    create: {
      sessionId: session1.id,
      userId: peerUser.id,
    },
  });

  // 9. Conversations, Participants & Messages
  const conversation = await prisma.conversation.upsert({
    where: { id: "conv_study_buddies" },
    update: {},
    create: {
      id: "conv_study_buddies",
      participants: {
        create: [{ userId: user.id }, { userId: peerUser.id }],
      },
      messages: {
        create: [
          {
            id: "msg_1",
            senderId: peerUser.id,
            content: "Hey Aarav! Are we still reviewing the Data Structures module today?",
            isAiGenerated: false,
          },
          {
            id: "msg_2",
            senderId: user.id,
            content: "Yes! Let's jump into the virtual study session around 6:00 PM.",
            isAiGenerated: false,
          },
        ],
      },
    },
  });

  // 10. Learning Goals
  await prisma.learningGoal.upsert({
    where: { id: "goal_1" },
    update: {},
    create: {
      id: "goal_1",
      userId: user.id,
      title: "Complete Python Data Science & Vectorized Math Modules",
      targetDate: new Date(Date.now() + 14 * 86400000),
      progress: 65,
    },
  });

  // 11. Notifications
  await prisma.notification.upsert({
    where: { id: "notif_1" },
    update: {},
    create: {
      id: "notif_1",
      userId: user.id,
      title: "🔥 7-Day Study Streak Maintained!",
      message: "Great job! You earned 150 bonus XP today for consistent active recall practice.",
      type: "STREAK",
      isRead: false,
    },
  });

  await prisma.notification.upsert({
    where: { id: "notif_2" },
    update: {},
    create: {
      id: "notif_2",
      userId: user.id,
      title: "Smart Revision Due",
      message: "Time to review 'Stack Frames vs Heap Objects' to lock in long-term retention.",
      type: "REVISION",
      isRead: false,
    },
  });

  console.log("🎉 All tables seeded successfully into Neon PostgreSQL!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
