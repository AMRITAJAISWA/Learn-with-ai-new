export interface TopicData {
  id: string;
  order: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  keyTakeaways: string[];
}

export interface ModuleData {
  id: string;
  order: number;
  title: string;
  description: string;
  topics: TopicData[];
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  category: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  targetOutcome: string;
  completionPct: number;
  isCompleted: boolean;
  learningSequence: string[];
  prerequisites: string[];
  modules: ModuleData[];
  createdAt: string;
}

export interface RevisionItemData {
  id: string;
  topicTitle: string;
  courseTitle: string;
  lastStudied: string;
  nextRevisionAt: string;
  intervalDays: number;
  difficulty: "Easy" | "Medium" | "Hard";
  performance: number; // 0-100
  needsPractice: boolean;
}

export interface QuestionData {
  id: string;
  questionText: string;
  type: "MCQ" | "TRUE_FALSE" | "SHORT";
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizData {
  id: string;
  title: string;
  topicTitle: string;
  difficulty: string;
  questions: QuestionData[];
  createdAt: string;
}

export interface QuizAttemptData {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  accuracyPct: number;
  timeSpentSec: number;
  weakTopics: string[];
  completedAt: string;
}

export interface FlashcardData {
  id: string;
  front: string;
  back: string;
  mastery: number; // 0 - 5
}

export interface FlashcardSetData {
  id: string;
  title: string;
  topic: string;
  cards: FlashcardData[];
  createdAt: string;
}

export interface StudyBuddyData {
  id: string;
  name: string;
  avatarUrl: string;
  education: string;
  college: string;
  courses: string[];
  learningGoals: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  preferredStudyTime: string;
  studyDuration: number;
  interests: string[];
  about: string;
  compatibilityPct: number;
  status: "CONNECTED" | "PENDING" | "DISCOVERABLE";
  isOnline: boolean;
}

export interface MessageData {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  isAiGenerated: boolean;
  timestamp: string;
}

export interface StudySessionData {
  id: string;
  title: string;
  subject: string;
  topic: string;
  scheduledAt: string;
  durationMin: number;
  goal: string;
  participants: string[];
  isCompleted: boolean;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: "REVISION" | "CHAT" | "QUIZ" | "STREAK" | "SESSION";
  isRead: boolean;
  createdAt: string;
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  educationLevel: string;
  college: string;
  targetSubjects: string[];
  skillLevel: string;
  learningGoals: string;
  preferredStudyDuration: number;
  preferredStudyTime: string;
  interests: string[];
  streakDays: number;
  totalXP: number;
  bio: string;
}

// Global in-memory singleton to persist updates during dev session
class InMemoryStore {
  user: UserProfileData = {
    id: "user_demo_123",
    name: "Aarav Patel",
    email: "aarav.patel@stanford.edu",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav",
    educationLevel: "Undergraduate (Computer Science)",
    college: "Stanford University",
    targetSubjects: ["Data Science", "Algorithms", "Machine Learning"],
    skillLevel: "Intermediate",
    learningGoals: "Prepare for Top-Tier AI & Machine Learning Engineering Roles",
    preferredStudyDuration: 60,
    preferredStudyTime: "Evening (6:00 PM - 9:00 PM)",
    interests: ["Neural Networks", "System Design", "Python", "Full-Stack AI"],
    streakDays: 7,
    totalXP: 1250,
    bio: "CS sophomore passionate about neural networks, distributed systems, and building AI tools.",
  };

  courses: CourseData[] = [
    {
      id: "course_python_ds",
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
        "Visual Storytelling with Matplotlib/Seaborn",
        "Capstone Machine Learning Pipeline",
      ],
      prerequisites: ["Basic logic and high school math"],
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      modules: [
        {
          id: "mod_1",
          order: 1,
          title: "Python Fundamentals & Syntax",
          description: "Variables, primitive data types, boolean logic, and dynamic typing principles.",
          topics: [
            {
              id: "top_1_1",
              order: 1,
              title: "Variables, Dynamic Typing & Memory Allocation",
              summary: "Understand how Python handles identifiers, references, and pointer references.",
              estimatedMinutes: 25,
              status: "COMPLETED",
              keyTakeaways: ["Everything in Python is an object", "Immutable vs mutable references"],
            },
            {
              id: "top_1_2",
              order: 2,
              title: "Conditional Logic & Control Flow",
              summary: "If-elif-else branching, ternary operators, and match-case patterns.",
              estimatedMinutes: 30,
              status: "COMPLETED",
              keyTakeaways: ["Truthy and falsy values", "Short-circuit evaluation in logic"],
            },
            {
              id: "top_1_3",
              order: 3,
              title: "Loops, Iterators & List Comprehensions",
              summary: "While loops, for loops with range, zip, enumerate, and vectorized comprehensions.",
              estimatedMinutes: 35,
              status: "COMPLETED",
              keyTakeaways: ["List comprehension syntax", "Generator expressions memory savings"],
            },
          ],
        },
        {
          id: "mod_2",
          order: 2,
          title: "Core Data Structures & Complexity",
          description: "Lists, Tuples, Sets, Dictionaries, and hashing performance.",
          topics: [
            {
              id: "top_2_1",
              order: 1,
              title: "Lists vs Tuples: Immutability & Use Cases",
              summary: "Contrasting dynamic arrays with immutable sequence tuples.",
              estimatedMinutes: 30,
              status: "COMPLETED",
              keyTakeaways: ["Tuple memory efficiency", "Slicing copy behavior"],
            },
            {
              id: "top_2_2",
              order: 2,
              title: "Dictionaries & Hash Maps in Python",
              summary: "Key-value indexing, hash collisions, dictionary comprehensions.",
              estimatedMinutes: 40,
              status: "IN_PROGRESS",
              keyTakeaways: ["O(1) average lookup", "dict.get() with fallback defaults"],
            },
            {
              id: "top_2_3",
              order: 3,
              title: "Sets & Venn Mathematical Operations",
              summary: "Union, intersection, symmetric difference, and deduplication.",
              estimatedMinutes: 25,
              status: "NOT_STARTED",
              keyTakeaways: ["Set hashing", "Subsets and supersets"],
            },
          ],
        },
        {
          id: "mod_3",
          order: 3,
          title: "Vectorized Computing with NumPy",
          description: "N-dimensional arrays, broadcasting rules, and linear algebra operations.",
          topics: [
            {
              id: "top_3_1",
              order: 1,
              title: "NumPy Ndarray Creation & Indexing",
              summary: "Allocating contiguous memory blocks, strides, and slicing.",
              estimatedMinutes: 45,
              status: "NOT_STARTED",
              keyTakeaways: ["Homogeneous data types", "Multi-axis indexing"],
            },
            {
              id: "top_3_2",
              order: 2,
              title: "Broadcasting Rules & Vectorized Speedups",
              summary: "How NumPy calculates operations across mismatched dimension tensors.",
              estimatedMinutes: 40,
              status: "NOT_STARTED",
              keyTakeaways: ["Trailing dimensions match", "Avoiding slow Python for-loops"],
            },
          ],
        },
      ],
    },
    {
      id: "course_dsa_trees",
      title: "Data Structures & Algorithms: Trees and Graphs",
      description:
        "Master non-linear structures, recursive traversal algorithms, Dijkstra, and dynamic programming.",
      category: "Computer Science",
      skillLevel: "Intermediate",
      estimatedHours: 30,
      targetOutcome: "Technical Interview Mastery",
      completionPct: 25,
      isCompleted: false,
      learningSequence: ["Binary Search Trees", "AVL Trees", "Graph Traversal", "Dynamic Programming"],
      prerequisites: ["Linear data structures", "Basic recursion"],
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      modules: [
        {
          id: "dsa_mod_1",
          order: 1,
          title: "Binary Trees & BST Properties",
          description: "Node structures, In-order, Pre-order, Post-order, and BFS level order.",
          topics: [
            {
              id: "dsa_top_1",
              order: 1,
              title: "Binary Search Tree Construction & Lookup",
              summary: "BST invariant, iterative vs recursive lookups, and height balance.",
              estimatedMinutes: 40,
              status: "COMPLETED",
              keyTakeaways: ["O(log N) average, O(N) worst case", "In-order traversal yields sorted order"],
            },
            {
              id: "dsa_top_2",
              order: 2,
              title: "Depth-First Search (DFS) & Call Stack Mechanics",
              summary: "Pre-order, in-order, post-order recursive architectures.",
              estimatedMinutes: 35,
              status: "IN_PROGRESS",
              keyTakeaways: ["Call stack space O(H)", "Post-order for subtree calculations"],
            },
          ],
        },
      ],
    },
  ];

  revisionItems: RevisionItemData[] = [
    {
      id: "rev_1",
      topicTitle: "Binary Search & Tree Invariants",
      courseTitle: "Data Structures & Algorithms",
      lastStudied: new Date(Date.now() - 2 * 86400000).toISOString(),
      nextRevisionAt: new Date().toISOString(), // Due today
      intervalDays: 2,
      difficulty: "Medium",
      performance: 65,
      needsPractice: true,
    },
    {
      id: "rev_2",
      topicTitle: "Python List Comprehensions & Generator Expressions",
      courseTitle: "Python for Data Science",
      lastStudied: new Date(Date.now() - 4 * 86400000).toISOString(),
      nextRevisionAt: new Date().toISOString(), // Due today
      intervalDays: 4,
      difficulty: "Easy",
      performance: 88,
      needsPractice: false,
    },
    {
      id: "rev_3",
      topicTitle: "Recursion & Call Stack Space Complexity",
      courseTitle: "Data Structures & Algorithms",
      lastStudied: new Date(Date.now() - 1 * 86400000).toISOString(),
      nextRevisionAt: new Date(Date.now() + 86400000).toISOString(), // Due tomorrow
      intervalDays: 1,
      difficulty: "Hard",
      performance: 50,
      needsPractice: true,
    },
    {
      id: "rev_4",
      topicTitle: "NumPy Vectorized Broadcasting Rules",
      courseTitle: "Python for Data Science",
      lastStudied: new Date(Date.now() - 3 * 86400000).toISOString(),
      nextRevisionAt: new Date(Date.now() + 2 * 86400000).toISOString(),
      intervalDays: 5,
      difficulty: "Medium",
      performance: 75,
      needsPractice: false,
    },
  ];

  quizzes: QuizData[] = [
    {
      id: "quiz_python_foundations",
      title: "Python Core Logic & Structures Diagnostic",
      topicTitle: "Variables & Data Structures",
      difficulty: "Beginner",
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: "q1",
          questionText: "Which of the following data structures in Python is immutable by default?",
          type: "MCQ",
          options: ["List", "Dictionary", "Tuple", "Set"],
          correctAnswer: "Tuple",
          explanation: "Tuples cannot have elements added, removed, or changed in place once instantiated.",
        },
        {
          id: "q2",
          questionText: "What is the average time complexity for checking membership ('key in dict') in a Python dictionary?",
          type: "MCQ",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          correctAnswer: "O(1)",
          explanation: "Dictionaries utilize hash table buckets, yielding amortized O(1) key lookups.",
        },
        {
          id: "q3",
          questionText: "What does the expression [x**2 for x in range(5) if x % 2 != 0] evaluate to?",
          type: "MCQ",
          options: ["[0, 1, 4, 9, 16]", "[1, 9]", "[4, 16]", "[1, 3]"],
          correctAnswer: "[1, 9]",
          explanation: "Odd numbers in 0..4 are 1 and 3. Their squares are 1 and 9.",
        },
        {
          id: "q4",
          questionText: "A generator expression calculates all its items in memory at once like a list.",
          type: "TRUE_FALSE",
          options: ["True", "False"],
          correctAnswer: "False",
          explanation: "Generators use lazy evaluation, computing items one by one on-demand via yield.",
        },
      ],
    },
  ];

  quizAttempts: QuizAttemptData[] = [
    {
      id: "attempt_1",
      quizId: "quiz_python_foundations",
      quizTitle: "Python Core Logic Diagnostic",
      score: 3,
      totalQuestions: 4,
      accuracyPct: 75.0,
      timeSpentSec: 140,
      weakTopics: ["Generators & Memory Optimization"],
      completedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  flashcardSets: FlashcardSetData[] = [
    {
      id: "set_python_essentials",
      title: "Python Data Science Foundations",
      topic: "Python Fundamentals",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      cards: [
        {
          id: "c1",
          front: "What makes a Python tuple hashable, and when can a tuple NOT be used as a dictionary key?",
          back: "A tuple is hashable only if all its constituent elements are also immutable and hashable. If a tuple contains a mutable list, it is unhashable and will throw a TypeError.",
          mastery: 4,
        },
        {
          id: "c2",
          front: "Explain the difference between 'is' and '==' in Python comparison logic.",
          back: "'==' tests for equality of values (invoking __eq__), while 'is' checks for memory identity (whether both variables point to the identical object in memory via id()).",
          mastery: 5,
        },
        {
          id: "c3",
          front: "What is NumPy array broadcasting, and what condition must dimensions satisfy?",
          back: "Broadcasting enables arithmetic between arrays of differing shapes. Two dimensions are compatible when: 1) they are equal, or 2) one of them is 1.",
          mastery: 2,
        },
        {
          id: "c4",
          front: "What is the Global Interpreter Lock (GIL) and how does it affect multi-threaded CPU tasks?",
          back: "The GIL is a mutex protecting access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously, bottlenecking CPU-bound multi-threading.",
          mastery: 3,
        },
      ],
    },
  ];

  studyBuddies: StudyBuddyData[] = [
    {
      id: "buddy_sarah",
      name: "Sarah Lin",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      education: "Undergraduate (Data Science & AI)",
      college: "MIT",
      courses: ["Python for Data Science", "Deep Learning"],
      learningGoals: "Master neural networks and predictive modeling",
      skillLevel: "Intermediate",
      preferredStudyTime: "Evening (6:00 PM - 9:00 PM)",
      studyDuration: 60,
      interests: ["Machine Learning", "Python", "Data Visualization"],
      about: "Third-year data science enthusiast. Love visualizing data insights and working through code problems together.",
      compatibilityPct: 96,
      status: "CONNECTED",
      isOnline: true,
    },
    {
      id: "buddy_david",
      name: "David Kim",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      education: "Undergraduate (Computer Science)",
      college: "UC Berkeley",
      courses: ["Data Structures & Algorithms", "Systems"],
      learningGoals: "FAANG Interview Preparation",
      skillLevel: "Intermediate",
      preferredStudyTime: "Night (8:00 PM - 11:00 PM)",
      studyDuration: 90,
      interests: ["Algorithms", "Tree Traversal", "LeetCode Hard"],
      about: "Practicing graph algorithms and dynamic programming. Always up for a peer mock interview session.",
      compatibilityPct: 91,
      status: "CONNECTED",
      isOnline: false,
    },
    {
      id: "buddy_amina",
      name: "Amina Al-Mansoor",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina",
      education: "Master's (Software Engineering)",
      college: "University of Washington",
      courses: ["Full Stack Web Development", "Cloud Architecture"],
      learningGoals: "Build high-throughput SaaS web apps",
      skillLevel: "Beginner",
      preferredStudyTime: "Morning (8:00 AM - 10:00 AM)",
      studyDuration: 45,
      interests: ["Next.js", "React", "Prisma", "PostgreSQL"],
      about: "Switching from electrical engineering into modern web platforms. Looking for collaborative partners to build projects.",
      compatibilityPct: 88,
      status: "DISCOVERABLE",
      isOnline: true,
    },
    {
      id: "buddy_marcus",
      name: "Marcus Vance",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      education: "Bachelor's (Applied Mathematics)",
      college: "Imperial College London",
      courses: ["Python for Data Science", "Linear Algebra"],
      learningGoals: "Quantitative Finance & Statistical Modeling",
      skillLevel: "Advanced",
      preferredStudyTime: "Afternoon (2:00 PM - 5:00 PM)",
      studyDuration: 60,
      interests: ["NumPy", "Probability", "Vectorized Calculus"],
      about: "Math major passionate about high performance computational math in Python.",
      compatibilityPct: 83,
      status: "DISCOVERABLE",
      isOnline: false,
    },
  ];

  conversations: {
    id: string;
    buddyId: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
  }[] = [];

  messages: MessageData[] = [];

  studySessions: StudySessionData[] = [
    {
      id: "session_1",
      title: "Binary Trees & BST Deep Dive",
      subject: "Data Structures & Algorithms",
      topic: "Binary Search Trees",
      scheduledAt: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
      durationMin: 60,
      goal: "Solve 15 traversal and height-balance problems together.",
      participants: ["Aarav Patel", "David Kim"],
      isCompleted: false,
    },
    {
      id: "session_2",
      title: "Pandas & Data Wrangling Lab",
      subject: "Python for Data Science",
      topic: "Dataframe Operations & Cleaning",
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      durationMin: 45,
      goal: "Clean a real estate dataset and generate correlation heatmaps.",
      participants: ["Aarav Patel", "Sarah Lin"],
      isCompleted: false,
    },
  ];

  notifications: NotificationData[] = [
    {
      id: "notif_1",
      title: "Revision Due Today",
      message: "Your 'Binary Search & Tree Invariants' spaced repetition is ready.",
      type: "REVISION",
      isRead: false,
      createdAt: "15 mins ago",
    },
    {
      id: "notif_2",
      title: "New Study Buddy Message",
      message: "Sarah Lin sent you a message about today's session.",
      type: "CHAT",
      isRead: false,
      createdAt: "25 mins ago",
    },
    {
      id: "notif_3",
      title: "Streak Milestone! 🔥",
      message: "Congratulations! You maintained your 7-day learning streak (+100 XP).",
      type: "STREAK",
      isRead: true,
      createdAt: "1 day ago",
    },
  ];
}

// Global instance in memory
const globalForStore = globalThis as unknown as {
  learnStore: InMemoryStore | undefined;
};

export const store = globalForStore.learnStore ?? new InMemoryStore();
if (process.env.NODE_ENV !== "production") globalForStore.learnStore = store;
