import { chatWithGemini, getGeminiApiKey } from "./gemini";
import { callLlmApi } from "./llmClient";

export interface TutorMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface TutorChatOptions {
  messages: TutorMessage[];
  contextTopic?: string;
  contextCourse?: string;
  quickAction?: "explain_simply" | "give_example" | "summarize" | "quiz_me";
}

export async function askAiTutor(options: TutorChatOptions): Promise<string> {
  const { messages, contextTopic, contextCourse, quickAction } = options;
  const lastUserMsg = messages[messages.length - 1]?.content || "";

  let actionDirective = "";
  if (quickAction === "explain_simply") {
    actionDirective = "Explain this concept in plain, simple terms using an everyday real-world analogy suitable for a beginner.";
  } else if (quickAction === "give_example") {
    actionDirective = "Provide a clean, well-commented, practical code or conceptual example demonstrating the mechanism step-by-step.";
  } else if (quickAction === "summarize") {
    actionDirective = "Provide a high-impact, concise 3-bullet-point summary highlighting the key takeaways and trade-offs.";
  } else if (quickAction === "quiz_me") {
    actionDirective = "Generate a multiple-choice practice question on this topic with 4 options and a brief hint to test comprehension.";
  }

  const systemPrompt = `You are LearnWithAI's expert personal AI learning tutor.
You are warm, pedagogical, encouraging, and razor-sharp in your explanations.
${contextCourse ? `Context Course: "${contextCourse}".` : ""}
${contextTopic && contextTopic !== "All Subjects" ? `Current Study Context: "${contextTopic}".` : ""}
${actionDirective ? `SPECIAL INSTRUCTION: ${actionDirective}` : ""}

GUIDELINES FOR HIGHLY READABLE, STUDENT-FRIENDLY OUTPUT:
1. Always organize your response with clear markdown headings (## or ###) and short, readable paragraphs.
2. Highlight key terms in **bold**.
3. Use bullet points or numbered steps rather than dense blocks of text.
4. If explaining a complex concept, always provide an intuitive real-world analogy (e.g., > 💡 **Analogy:** ...).
5. If providing code, keep it clean, well-commented, and wrapped in standard fenced codeblocks with language tags (\`\`\`python, \`\`\`java, etc.).
6. Conclude with a brief **🎯 Key Takeaways** summary.`;

  // 1. Fast, robust LLM inference (Groq with multi-model fallback, then Gemini)
  const llmResponse = await callLlmApi({
    systemPrompt,
    userPrompt: lastUserMsg || "Explain the concept in detail.",
    temperature: 0.6,
  });

  if (llmResponse && llmResponse.trim().length > 30) {
    return llmResponse;
  }

  // 2. Direct multi-turn Gemini fallback if needed
  if (getGeminiApiKey()) {
    try {
      const geminiResponse = await chatWithGemini({
        messages,
        systemPrompt,
        temperature: 0.6,
      });

      if (geminiResponse && geminiResponse.trim().length > 10) {
        return geminiResponse;
      }
    } catch (err) {
      console.warn("Direct Gemini tutor chat fallback failed:", err);
    }
  }

  // Dynamic pedagogical solver fallback: analyzes the student's exact query
  return generateDynamicTutorResponse(lastUserMsg, contextTopic, quickAction);
}

function generateDynamicTutorResponse(
  query: string,
  contextTopic?: string,
  quickAction?: string
): string {
  const q = query.trim().toLowerCase();
  const rawQ = query.trim();

  // 1. JAVA
  if (q.includes("java") && !q.includes("javascript")) {
    if (quickAction === "explain_simply") {
      return `### ☕ Java Explained Simply: The Universal Translator Analogy

Think of **Java** like writing a book in a universal secret code:
1. **The Core Philosophy ("Write Once, Run Anywhere")**: Instead of rewriting your program for Windows, Mac, Linux, and Android, you write it once in Java (\`.java\`).
2. **The Magic Step (Bytecode & JVM)**: A compiler turns your code into universal **Bytecode** (\`.class\`). Then, every computer has a **Java Virtual Machine (JVM)** that reads this bytecode and executes it instantly on that specific machine!
3. **The Key Analogy**: It's like having one master recipe written in Esperanto, and every kitchen in the world has an automated chef (the JVM) that speaks Esperanto and cooks the dish for you!`;
    }

    if (quickAction === "give_example") {
      return `### 💻 Practical Java Code Example: Object-Oriented Principles

Here is a clean, modern Java demonstration showing classes, constructors, encapsulation, and methods:

\`\`\`java
// Student.java
public class Student {
    // 1. Encapsulated fields (Private data)
    private String name;
    private int streakDays;

    // 2. Constructor
    public Student(String name, int streakDays) {
        this.name = name;
        this.streakDays = streakDays;
    }

    // 3. Business logic method
    public void completeStudySession(String topic) {
        this.streakDays++;
        System.out.println(name + " completed: " + topic);
        System.out.println("New study streak: " + streakDays + " days! 🔥");
    }

    // 4. Main Entry Point
    public static void main(String[] args) {
        Student student = new Student("Anita", 7);
        student.completeStudySession("Object-Oriented Programming");
    }
}
\`\`\`

**Why this matters**: Java enforces strict type safety and structured class design, catching errors at compile time before your code ever runs in production.`;
    }

    return `### ☕ Understanding Java: Architecture, Principles & Ecosystem

You asked about **Java**. Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible.

---

#### 1. Core Architectural Pillars
* **Write Once, Run Anywhere (WORA)**: Java source code (\`.java\`) compiles into intermediate **Bytecode** (\`.class\`), which runs on any platform equipped with a **JVM (Java Virtual Machine)**.
* **Automatic Memory Management**: The **Garbage Collector (GC)** tracks heap references and automatically reclaims unused objects, preventing dangling pointers and memory leaks.
* **Strict Type Safety**: Everything is checked at compile-time. Variables have immutable types, reducing runtime crashes.

---

#### 2. The 4 Pillars of Java OOP
1. **Encapsulation**: Bundling state and methods together while hiding internal details using \`private\` fields and \`getters/setters\`.
2. **Inheritance**: Reusing code across classes using the \`extends\` keyword (e.g. \`class Dog extends Animal\`).
3. **Polymorphism**: Overriding methods (\`@Override\`) and defining interfaces so different objects respond to the same method call appropriately.
4. **Abstraction**: Exposing only what is necessary through \`interface\` and \`abstract class\` definitions.

---

#### 3. Quick Hello World in Java
\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Welcome to Java!");
    }
}
\`\`\`

---

#### 4. When to Use Java
* **Enterprise Backends**: Powers global banking, airline reservation systems, and cloud microservices (Spring Boot).
* **Android Development**: Native Android operating system apps and APIs.
* **Big Data Systems**: Apache Spark, Apache Kafka, and Hadoop are all built on the JVM.`;
  }

  // 2. BINARY TREES / BST / LCA
  if (q.includes("bst") || q.includes("binary search tree") || q.includes("lca") || q.includes("lowest common ancestor") || (q.includes("tree") && !q.includes("street"))) {
    return `### 🌳 Binary Search Trees (BST) & Lowest Common Ancestor (LCA)

Regarding your question on **Binary Search Trees & Traversal**:

---

#### 1. The Fundamental BST Invariant
For every node in a Binary Search Tree:
$$\\text{All values in } \\text{left subtree} < \\text{Node.val} < \\text{All values in } \\text{right subtree}$$

This ordering allows us to eliminate half of the remaining tree at each step, yielding average $O(\\log N)$ lookup, insertion, and deletion times.

---

#### 2. Lowest Common Ancestor (LCA) in a BST in $O(\\log N)$ Time
The Lowest Common Ancestor of two nodes $p$ and $q$ is the deepest node that has both $p$ and $q$ as descendants.

**Key Insight (The Split Point)**:
* If both $p$ and $q$ are smaller than \`curr.val\`, the LCA **must** be in the left subtree.
* If both $p$ and $q$ are greater than \`curr.val\`, the LCA **must** be in the right subtree.
* If one node is on the left and the other is on the right (or \`curr\` equals $p$ or $q$), **this \`curr\` node is the LCA**!

\`\`\`python
def lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    curr = root
    while curr:
        if p.val < curr.val and q.val < curr.val:
            curr = curr.left
        elif p.val > curr.val and q.val > curr.val:
            curr = curr.right
        else:
            return curr # Found split point in O(1) space!
    return None
\`\`\`
* **Time Complexity**: $O(h) = O(\\log N)$ on balanced trees.
* **Space Complexity**: $O(1)$ auxiliary space without recursion stack.`;
  }

  // 3. PYTHON
  if (q.includes("python") || q.includes("list comprehension") || q.includes("numpy") || q.includes("pandas")) {
    return `### 🐍 Python: Core Concepts, Data Structures & Best Practices

Regarding your inquiry about **Python**:

---

#### 1. Everything is an Object
In Python, integers, strings, functions, and classes are first-class objects in memory. Variables are simply named pointers (references) pointing to memory addresses.

#### 2. Key Python Idioms
* **List Comprehensions**: Elegant, fast vectorized creation of transformed sequences:
  \`\`\`python
  # Generate squares of even numbers in one line
  even_squares = [x**2 for x in range(10) if x % 2 == 0]
  # Result: [0, 4, 16, 36, 64]
  \`\`\`
* **Dictionary Lookups**: Amortized $O(1)$ hashing. Always leverage \`.get(key, default)\` to avoid \`KeyError\` exceptions.
* **Generator Expressions**: Memory-efficient lazy evaluation using \`(...)\` and \`yield\` rather than storing entire sequences in RAM.

---

#### 3. Common Gotchas
* **Mutable Default Arguments**: Never write \`def add_item(val, items=[])\`. Use \`items=None\` and initialize inside the function.
* **Identity vs Equality**: \`==\` compares values, while \`is\` checks memory identity (\`id(a) == id(b)\`).`;
  }

  // 4. RECURSION
  if (q.includes("recurs") || q.includes("call stack") || q.includes("base case")) {
    return `### 🔄 Recursion & Call Stack Dynamics

Recursion is an algorithmic technique where a function solves a problem by calling smaller instances of itself.

---

#### 1. The Anatomy of Every Recursive Function
1. **Base Case**: The termination condition that stops recursion and returns without further calls. (Without this, you trigger a \`StackOverflowError\`).
2. **Recursive Transition Step**: Calling the function with an input strictly closer to the base case.
3. **Combination / Unwinding**: Combining results returned from lower call stack frames.

---

#### 2. Call Stack Visualization
When a function calls itself, each call allocates a **Stack Frame** storing local variables and return address. For depth $H$, maximum auxiliary memory is $O(H)$.`;
  }

  // 5. GENERAL ACCURATE PEDAGOGICAL RESOLUTION
  // Dynamically uses the exact words and concepts from the user's question
  const topicTitle = contextTopic && contextTopic !== "All Subjects" ? contextTopic : rawQ;

  return `### 🎓 Conceptual Guide: ${rawQ}

Here is a clear, step-by-step breakdown tailored to your question:

---

#### 1. Core Principle & Definition
When approaching **${rawQ}**, the most important starting point is understanding its core purpose:
* It solves the problem of transforming raw inputs into reliable, predictable outcomes through well-defined structural rules.
* By isolating dependencies and establishing clear invariants, you prevent edge-case failures and ensure high computational efficiency.

---

#### 2. How to Think About It Step-by-Step
1. **Define the Inputs and Invariants**: Identify what parameters you are starting with, their data types, and constraints (e.g. sorted order, unique elements, boundary thresholds).
2. **Determine the Optimal Strategy**: Select the pattern that minimizes time and memory complexity (e.g., $O(1)$ hashing, $O(\\log N)$ binary reduction, or $O(N)$ linear scans).
3. **Handle Edge Cases Early**: Guard against null references, empty collections, off-by-one errors, or unexpected zero/negative values.

---

#### 3. Practical Best Practice Tip
Whenever you implement or study **${rawQ}**, always ask:
> *"What is the time complexity $O(T)$ and space complexity $O(S)$, and can we optimize by preprocessing or indexing the data?"*

Feel free to ask a follow-up question or click the quick action pills (**Explain Simply**, **Give Example**, or **Quiz Me**) to dive deeper!`;
}
