export interface VideoSuggestion {
  title: string;
  youtubeId: string;
  url: string;
  channel: string;
  duration: string;
  thumbnailUrl: string;
  summary: string;
}

export interface EnrichedTopicDetails {
  textBasedContent: string;
  codeSnippet: string;
  commonMistakes: string[];
  keyTakeaways: string[];
  videoSuggestion: VideoSuggestion;
}

export const TOPIC_CONTENT_REGISTRY: Record<string, EnrichedTopicDetails> = {
  // 1.1 Variables, Dynamic Typing & Memory Allocation
  top_1_1: {
    keyTakeaways: [
      "Everything in Python is an object stored on the private heap.",
      "Variables are named references (pointers) to objects, not fixed memory slots.",
      "Immutable types (int, float, str, tuple) cannot be modified in place; reassigning creates a new object.",
      "Mutable types (list, dict, set) can be mutated in place, affecting all variables referencing that object.",
    ],
    commonMistakes: [
      "Assuming a = b makes a copy of a list; it only copies the memory reference pointer!",
      "Modifying a default list argument in a function signature: def append_to(item, list=[]).",
      "Confusing '==' (value equality) with 'is' (memory identity check).",
    ],
    codeSnippet: `# 1. References vs Copies in Python Memory
x = [1, 2, 3]
y = x       # y points to the EXACT SAME memory address as x
y.append(4)
print(f"x: {x}") # Output: [1, 2, 3, 4] -> Both changed!

# 2. Immutable Variables
a = 1000
b = a
b += 1      # Creates a NEW integer object in memory
print(f"a: {a}, b: {b}") # a is 1000, b is 1001

# 3. Checking Memory Identity with id()
print(f"x is y: {x is y}") # True (Same memory address: {hex(id(x))})`,
    textBasedContent: `### 📌 Deep Dive: Variables, Memory & Object References in Python

In Python, the way memory and variables behave is fundamentally different from languages like C, C++, or Java. Understanding this mental model is the foundation of writing bug-free, high-performance Python code.

---

#### 1. The Names and References Mental Model
In low-level languages, a variable is like a named box with a fixed memory address where values are stored directly.
In Python, **variables are not boxes—they are nametags attached to objects**.
* All objects live on the Python Private Heap managed by the CPython memory manager.
* An assignment like \`x = [1, 2, 3]\` does two things:
  1. Creates a \`list\` object on the heap containing references to \`1\`, \`2\`, and \`3\`.
  2. Binds the identifier \`x\` as a reference pointer to that heap object.

---

#### 2. Mutability vs Immutability
Every object in Python has three core properties:
* **Identity (\`id()\`)**: Its physical memory address in RAM.
* **Type (\`type()\`)**: What kind of object it is (e.g. \`int\`, \`str\`, \`list\`).
* **Value**: The data it encapsulates.

| Category | Data Types | What happens when modified? |
| :--- | :--- | :--- |
| **Immutable** | \`int\`, \`float\`, \`str\`, \`tuple\`, \`bool\`, \`frozenset\` | A completely new object is allocated in RAM. |
| **Mutable** | \`list\`, \`dict\`, \`set\`, custom classes | The object is modified in-place at the same memory address. |

---

#### 3. Garbage Collection & Reference Counting
CPython primarily uses **Reference Counting**: every object has an internal counter tracking how many references point to it. When the count drops to zero, CPython immediately deallocates the memory. A cyclic garbage collector periodically cleans up circular references.`,
    videoSuggestion: {
      title: "Python Variables & Mutability: Pointers, Memory Allocation & id()",
      youtubeId: "rfscVS0vtbw",
      url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      channel: "freeCodeCamp.org",
      duration: "18:42",
      thumbnailUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80",
      summary: "Comprehensive walkthrough of Python's memory model, pointer references, and mutable vs immutable behaviors with interactive memory diagrams.",
    },
  },

  // 1.2 Conditional Logic & Control Flow
  top_1_2: {
    keyTakeaways: [
      "Truthy vs Falsy: Empty containers ([], {}, ''), 0, and None evaluate to False in boolean contexts.",
      "Short-Circuit Evaluation: Python evaluates 'and' / 'or' expressions lazily from left to right.",
      "Pattern Matching (match/case): Introduced in Python 3.10 for expressive structural deconstruction.",
    ],
    commonMistakes: [
      "Using 'if len(items) > 0' instead of idiomatic Python 'if items:'.",
      "Using 'is' to compare numbers or strings: write 'x == 10', not 'x is 10'.",
    ],
    codeSnippet: `# 1. Idiomatic Truthiness Check
user_roles = []
if not user_roles:
    print("User has no assigned permissions (Falsy evaluation)")

# 2. Short-Circuit Evaluation & Fallbacks
api_token = None
active_token = api_token or "DEFAULT_PUBLIC_DEMO_KEY"

# 3. Python 3.10+ Structural Pattern Matching
def parse_command(command):
    match command.split():
        case ["load", filename]:
            return f"Loading dataset from: {filename}"
        case ["train", model_type, *hyperparams]:
            return f"Training {model_type} with parameters {hyperparams}"
        case _:
            return "Unrecognized system command"

print(parse_command("train ResNet lr=0.001 epochs=50"))`,
    textBasedContent: `### 📌 Deep Dive: Conditional Logic, Boolean Truthiness & Pattern Matching

Control flow dictates the decision tree of your code. In Python, writing expressive, idiomatic conditional logic avoids nested spaghetti code and makes your pipelines resilient to missing data.

---

#### 1. Truthy and Falsy Axioms
In Python, you do not need to explicitly check \`if x == True\` or \`if len(my_list) != 0\`. Python defines inherent truthiness:
* **Falsy Objects**: \`None\`, \`False\`, \`0\`, \`0.0\`, \`""\`, \`[]\`, \`{}\`, \`set()\`, \`()\`
* **Truthy Objects**: Any non-zero numeric value, non-empty container, or non-None object instance.

---

#### 2. Short-Circuiting Mechanics
* **\`A and B\`**: If \`A\` is falsy, Python returns \`A\` immediately and never evaluates \`B\`.
* **\`A or B\`**: If \`A\` is truthy, Python returns \`A\` immediately without evaluating \`B\`.
This allows safe parameter guards like \`user and user.is_authenticated()\`.`,
    videoSuggestion: {
      title: "Python Conditionals, Boolean Logic & Structural Pattern Matching",
      youtubeId: "DZwmZ8Usvnk",
      url: "https://www.youtube.com/watch?v=DZwmZ8Usvnk",
      channel: "Corey Schafer",
      duration: "14:15",
      thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      summary: "Mastering conditional branching, boolean operators, truthy/falsy logic, and the Python 3.10 match-case statement.",
    },
  },

  // 1.3 Loops, Iterators & List Comprehensions
  top_1_3: {
    keyTakeaways: [
      "List comprehensions are faster than append loops because iteration runs at C-level in CPython bytecode.",
      "Use enumerate() when you need both the index and the item during a loop.",
      "Use zip() to iterate across multiple parallel sequences simultaneously.",
      "Use generator expressions (x for x in data) for massive datasets to prevent Out-Of-Memory (OOM) crashes.",
    ],
    commonMistakes: [
      "Writing 'for i in range(len(items))' to access items[i] instead of 'for item in items:' or 'for i, item in enumerate(items):'.",
      "Creating nested list comprehensions that are 4 lines long and unreadable.",
    ],
    codeSnippet: `# 1. List Comprehensions vs For Loops
raw_readings = [12.4, -999.0, 15.8, 18.2, -999.0, 22.1]
# Filter out corrupted sensor readings and convert to Fahrenheit in 1 line:
valid_fahrenheit = [(c * 9/5) + 32 for c in raw_readings if c > -100]
print(f"Cleaned Fahrenheit: {valid_fahrenheit}")

# 2. Iterating with zip and enumerate
students = ["Anita", "Sarah", "David"]
scores = [95, 88, 92]
for rank, (name, score) in enumerate(zip(students, scores), start=1):
    print(f"Rank #{rank}: {name} - {score} XP")

# 3. Generator Expression (Lazy Memory Allocation)
import sys
large_comp = [x**2 for x in range(1_000_000)]
large_gen = (x**2 for x in range(1_000_000))
print(f"List Comp RAM: {sys.getsizeof(large_comp):,} bytes") # ~8.4 MB
print(f"Generator RAM: {sys.getsizeof(large_gen):,} bytes")   # ~104 bytes!`,
    textBasedContent: `### 📌 Deep Dive: High-Performance Loops, Iterators & Comprehensions

Loops are the workhorses of data engineering. Writing idiomatic Python iterations not only makes your codebase cleaner, but also achieves order-of-magnitude speedups by taking advantage of pre-compiled C loops in CPython.

---

#### 1. Why List Comprehensions are Faster
When you write:
\`\`\`python
res = []
for x in items:
    res.append(x * 2)
\`\`\`
Every loop iteration performs a Python bytecode attribute lookup on \`.append\`, increases stack frames, and dynamically resizes the array.
A list comprehension \`[x * 2 for x in items]\` utilizes a specialized CPython bytecode instruction called \`LIST_APPEND\`, avoiding method lookup overhead.

---

#### 2. The Iterator Protocol
Any object implementing \`__iter__()\` and \`__next__()\` is an iterator. When you use \`for item in collection:\`, Python automatically requests the iterator and invokes \`next()\` until \`StopIteration\` is raised.`,
    videoSuggestion: {
      title: "Python List Comprehensions, Enumerate & Zip Masterclass",
      youtubeId: "3dt4RGs5jtA",
      url: "https://www.youtube.com/watch?v=3dt4RGs5jtA",
      channel: "Corey Schafer",
      duration: "19:50",
      thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
      summary: "Visualizing list comprehensions, dictionary comprehensions, zip, and generator memory performance in practical projects.",
    },
  },

  // 2.1 Lists vs Tuples: Immutability & Use Cases
  top_2_1: {
    keyTakeaways: [
      "Lists are variable-length dynamic arrays; Tuples are fixed-length immutable sequences.",
      "Tuples have lower memory overhead and are stored in a single contiguous memory block.",
      "Tuples containing only immutable elements are hashable and can be used as dictionary keys.",
    ],
    commonMistakes: [
      "Using a list for fixed coordinate pairs (x, y) where a tuple (x, y) or namedtuple is safer and faster.",
      "Attempting to mutate a tuple element: t[0] = 5 raises TypeError.",
    ],
    codeSnippet: `# 1. Tuple Memory & Performance
import sys

list_sample = [1, 2, 3, 4, 5]
tuple_sample = (1, 2, 3, 4, 5)

print(f"List Size: {sys.getsizeof(list_sample)} bytes")   # ~104 bytes (over-allocated)
print(f"Tuple Size: {sys.getsizeof(tuple_sample)} bytes") # ~80 bytes (fixed memory block)

# 2. Tuples as Dictionary Keys
geo_cache = {
    (37.7749, -122.4194): "San Francisco Campus",
    (42.3601, -71.0942): "MIT Cambridge Lab"
}
print(geo_cache[(37.7749, -122.4194)])`,
    textBasedContent: `### 📌 Deep Dive: Lists vs Tuples: Architecture & Performance

Both lists and tuples store ordered sequences of elements. However, their internal memory layout and mutability guarantees make them suited for entirely different architectural roles.

---

#### 1. Dynamic Array Growth Factor in Lists
When a Python list grows (via \`.append()\`), it does not allocate memory for just one additional element. To achieve amortized $O(1)$ append time, CPython over-allocates extra slots:
\`0, 4, 8, 16, 24, 32, 40, 52, 64, 76, ...\`
This means lists always carry unused memory buffer overhead.

#### 2. The Fixed-Allocation Efficiency of Tuples
Tuples have a fixed size known at instantiation time. CPython allocates exactly the required number of pointers, with zero wasted buffer capacity. Additionally, for small tuples ($\le 20$ elements), CPython reuses deallocated blocks through a free list, avoiding kernel \`malloc\` calls!`,
    videoSuggestion: {
      title: "Lists vs Tuples in Python: Deep Dive Memory & Speed Benchmark",
      youtubeId: "NI264ZpFbqc",
      url: "https://www.youtube.com/watch?v=NI264ZpFbqc",
      channel: "mCoding",
      duration: "12:18",
      thumbnailUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80",
      summary: "Under the hood analysis of list dynamic array resizing vs tuple fixed block allocation and hashability.",
    },
  },

  // 2.2 Dictionaries & Hash Maps in Python
  top_2_2: {
    keyTakeaways: [
      "Python dictionaries offer amortized O(1) time complexity for insert, lookup, and delete operations.",
      "Since Python 3.7+, dictionaries are guaranteed to maintain insertion order.",
      "Keys must be hashable (must implement __hash__ and __eq__ that remain immutable over time).",
    ],
    commonMistakes: [
      "Accessing a missing key with dict[key] causing a KeyError; use dict.get(key, default) instead.",
      "Modifying a dictionary's keys while iterating directly over it.",
    ],
    codeSnippet: `# 1. Modern Dict Operations & Merging (Python 3.9+)
student_profile = {"name": "Anita", "college": "UEM", "xp": 150}
course_update = {"xp": 250, "streak": 2}

# Merge dictionaries cleanly using the union operator '|'
merged_profile = student_profile | course_update
print(f"Merged Profile: {merged_profile}")

# 2. Counting Elements Efficiently
from collections import Counter, defaultdict
submissions = ["Python", "Java", "Python", "C++", "Python", "Java"]
counts = Counter(submissions)
print(f"Most popular: {counts.most_common(1)}") # [('Python', 3)]

# 3. Defaultdict for Grouping
grouped = defaultdict(list)
grouped["Algorithms"].append("Binary Search")
grouped["Algorithms"].append("Dijkstra")
print(dict(grouped))`,
    textBasedContent: `### 📌 Deep Dive: How Python Dictionaries Work Under The Hood

The dictionary (\`dict\`) is the backbone of Python—namespaces, module imports, class attributes, and \`**kwargs\` are all built on Python dictionaries.

---

#### 1. Hash Tables & Hash Collisions
When you execute \`d[key] = value\`:
1. Python computes a 64-bit integer hash: \`h = hash(key)\`.
2. It maps the hash to an index in a dense hash table: \`index = h & (table_size - 1)\`.
3. If two different keys produce the same bucket index (**hash collision**), CPython resolves it using **open addressing with pseudo-random probing**: \`perturb >>= 5; i = (5*i + 1 + perturb) & mask\`.

---

#### 2. The Compact Dict Architecture (Raymond Hettinger's Innovation)
Prior to Python 3.6, dictionaries had high memory waste. The modern dict separates:
* **Indices Array**: A sparse array storing small integers (e.g. \`[-1, 0, -1, 1]\`).
* **Entries Array**: A dense, compact array storing \`[hash, key_ptr, value_ptr]\` in exact insertion order.
This slashed dictionary RAM consumption by **35%** while guaranteeing insertion-order preservation!`,
    videoSuggestion: {
      title: "How Python Dictionaries Actually Work Under The Hood",
      youtubeId: "npw4s1QTmPg",
      url: "https://www.youtube.com/watch?v=npw4s1QTmPg",
      channel: "ArjanCodes",
      duration: "16:40",
      thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80",
      summary: "Visualizing hash functions, collision probing, and the modern compact hash table design in CPython.",
    },
  },

  // 2.3 Sets & Venn Mathematical Operations
  top_2_3: {
    keyTakeaways: [
      "Sets store unique, unordered, hashable elements with O(1) membership checking ('x in s').",
      "Support mathematical Venn operations: Union (|), Intersection (&), Difference (-), Symmetric Difference (^).",
      "Frozensets are immutable variants that can be stored inside other sets or used as dictionary keys.",
    ],
    commonMistakes: [
      "Creating an empty set with '{}' (which creates an empty dictionary!). Use 'set()' instead.",
      "Attempting to add unhashable items like lists or dictionaries into a set.",
    ],
    codeSnippet: `# 1. Mathematical Venn Set Operations
enrolled_in_ai = {"Anita", "Sarah", "David", "Marcus"}
enrolled_in_dsa = {"David", "Marcus", "Amina", "Aarav"}

# Students taking BOTH courses (Intersection)
both = enrolled_in_ai & enrolled_in_dsa
print(f"Dual Enrollment: {both}") # {'David', 'Marcus'}

# Students taking ONLY AI (Difference)
only_ai = enrolled_in_ai - enrolled_in_dsa
print(f"Only AI: {only_ai}") # {'Anita', 'Sarah'}

# All unique students (Union)
all_students = enrolled_in_ai | enrolled_in_dsa
print(f"Total Unique Students: {len(all_students)}") # 6`,
    textBasedContent: `### 📌 Deep Dive: Sets & Mathematical Set Theory in Python

A \`set\` is an unordered collection of unique, hashable objects. Under the hood, Python sets are implemented almost identically to dictionaries, but with only keys and no values.

---

#### 1. Why Set Lookups are O(1) vs List O(N)
If you have a list of $1,000,000$ elements, checking \`if target in my_list\` requires scanning through every item sequentially ($O(N)$ operations).
With a set, Python hashes \`target\`, immediately jumps to the calculated bucket index, and checks for existence in **$O(1)$ constant time**!

---

#### 2. Venn Diagram Operators Quick Reference
* **Union (\`A | B\` or \`A.union(B)\`)**: All items in A, B, or both.
* **Intersection (\`A & B\` or \`A.intersection(B)\`)**: Items present in BOTH A and B.
* **Difference (\`A - B\` or \`A.difference(B)\`)**: Items present in A but NOT in B.
* **Symmetric Difference (\`A ^ B\` or \`A.symmetric_difference(B)\`)**: Items in A or B, but NOT both.`,
    videoSuggestion: {
      title: "Python Sets & Set Operations: Speed, Unions & Intersections",
      youtubeId: "sBvaPopWOmQ",
      url: "https://www.youtube.com/watch?v=sBvaPopWOmQ",
      channel: "Corey Schafer",
      duration: "13:25",
      thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80",
      summary: "Everything you need to know about sets, deduplication, Venn operations, and frozensets in Python.",
    },
  },

  // 3.1 NumPy Ndarray Creation & Indexing
  top_3_1: {
    keyTakeaways: [
      "NumPy arrays (ndarrays) store homogeneous data in contiguous memory blocks for cache efficiency.",
      "Array slicing in NumPy returns a memory 'view', NOT a copy. Modifying the slice modifies the original array!",
      "Vectorized operations take advantage of SIMD (Single Instruction, Multiple Data) CPU hardware acceleration.",
    ],
    commonMistakes: [
      "Forgetting to call .copy() when you want an independent sub-array.",
      "Mixing heterogeneous data types which forces NumPy to upcast the entire array to 'object' dtype, destroying performance.",
    ],
    codeSnippet: `import numpy as np

# 1. Contiguous Array Allocation
arr = np.array([[10, 20, 30], [40, 50, 60]], dtype=np.int32)
print(f"Shape: {arr.shape}, Dtype: {arr.dtype}, Strides: {arr.strides}")

# 2. Views vs Copies
sub_view = arr[0, :2] # Slicing returns a VIEW!
sub_view[0] = 999     # Mutates the original array!
print(f"Original after slice modification:\\n{arr}")

# 3. Boolean Masking (Filtering without loops)
scores = np.array([65, 82, 94, 45, 78, 91])
honors = scores[scores >= 90]
print(f"Honors Scores: {honors}") # [94, 91]`,
    textBasedContent: `### 📌 Deep Dive: NumPy Ndarrays, Contiguous Memory & Strided Indexing

NumPy is the foundational layer upon which the entire modern AI and scientific Python ecosystem is built (Pandas, SciPy, Scikit-Learn, PyTorch, TensorFlow).

---

#### 1. Why Pure Python Lists are Slow for Math
A Python list of numbers is actually an array of pointers to individual \`PyObject\` float or int structs scattered throughout heap memory. Every mathematical operation requires pointer chasing, unboxing, and type inspection.
A NumPy \`ndarray\` stores raw binary bytes (e.g. 32-bit floats) packed side-by-side in **contiguous memory**. The CPU can load entire cache lines into L1/L2 caches and execute parallel math instructions using SIMD.

---

#### 2. The Strides Concept
Every NumPy array has a \`strides\` tuple that tells it how many bytes to skip in memory to advance by one step along each axis. This allows operations like transpose (\`.T\`), slicing, and reshaping to be performed in **$O(1)$ constant time** with zero memory copies!`,
    videoSuggestion: {
      title: "NumPy Crash Course: Arrays, Vectorization & Memory Strides",
      youtubeId: "QUT1VHiLmmI",
      url: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
      channel: "freeCodeCamp.org",
      duration: "58:30",
      thumbnailUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80",
      summary: "From zero to advanced array engineering with NumPy, indexing, slicing, views vs copies, and broadcasting.",
    },
  },

  // 3.2 Broadcasting Rules & Vectorized Speedups
  top_3_2: {
    keyTakeaways: [
      "Broadcasting allows arithmetic operations between arrays of different shapes without copying data in RAM.",
      "The Two Golden Rules: Two dimensions are compatible when: 1. They are equal, OR 2. One of them is 1.",
      "Avoid Python for-loops over arrays; vectorized operations are 50x-100x faster.",
    ],
    commonMistakes: [
      "Attempting to broadcast mismatched shapes like (3, 4) and (3, 5); trailing dimensions do not match and neither is 1.",
      "Using slow Python loops to normalize data instead of '(arr - mean) / std'.",
    ],
    codeSnippet: `import numpy as np

# 1. Broadcasting in Action
# Shape (3, 3) matrix
matrix = np.array([
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
])

# Shape (3,) row vector -> Broadcasts across all 3 rows automatically!
row_mean = np.array([5, 10, 15])
normalized = matrix - row_mean
print("Broadcasting matrix - row_mean:")
print(normalized)

# 2. Pairwise Euclidean Distance Matrix using (N, 1) and (1, N)
points = np.array([1, 4, 8, 12])
# Reshape to (4, 1) and (1, 4)
diff_matrix = points[:, np.newaxis] - points[np.newaxis, :]
distance_matrix = np.abs(diff_matrix)
print("Pairwise distance matrix:")
print(distance_matrix)`,
    textBasedContent: `### 📌 Deep Dive: NumPy Broadcasting Mechanics & Vectorization

Broadcasting is NumPy's superpower. It describes how NumPy treats arrays with different shapes during arithmetic operations without creating redundant duplicate arrays in memory.

---

#### 1. The Strict Rules of Broadcasting
When operating on two arrays, NumPy compares their shapes element-wise, **starting with the trailing (rightmost) dimensions and working backwards**:
1. Two dimensions are compatible if they are **equal**.
2. Two dimensions are compatible if **one of them is 1**.
If neither condition is met, a \`ValueError: operands could not be broadcast together\` is thrown.

---

#### 2. Vectorized Performance Benchmark
In benchmark tests, summing an array of $10,000,000$ numbers in pure Python takes $\approx 750\\text{ ms}$.
In NumPy, \`np.sum(arr)\` runs in $\approx 8\\text{ ms}$—a **90x speedup**—because it executes in compiled C using SIMD instructions.`,
    videoSuggestion: {
      title: "NumPy Broadcasting Rules Visually Explained in 10 Minutes",
      youtubeId: "o8pxacQDmqo",
      url: "https://www.youtube.com/watch?v=o8pxacQDmqo",
      channel: "StatQuest with Josh Starmer",
      duration: "11:42",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      summary: "Clear visual diagrams demonstrating how dimensions stretch and broadcast across 1D, 2D, and 3D tensors.",
    },
  },

  // DSA Topic 1: BST Construction & Lookup
  dsa_top_1: {
    keyTakeaways: [
      "BST Invariant: For every node, Left Subtree < Node < Right Subtree.",
      "Average lookup, insertion, and deletion is O(log N) for balanced trees; worst case is O(N) for degenerate linked lists.",
      "In-Order traversal (Left, Root, Right) of a BST always yields values in strictly sorted ascending order.",
    ],
    commonMistakes: [
      "Assuming a binary tree is balanced by default; sequential insertions (1, 2, 3, 4) create a degenerate O(N) tree.",
      "Modifying tree nodes during traversal without tracking pointer links.",
    ],
    codeSnippet: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)
            return
        curr = self.root
        while True:
            if val < curr.val:
                if not curr.left:
                    curr.left = TreeNode(val)
                    break
                curr = curr.left
            else:
                if not curr.right:
                    curr.right = TreeNode(val)
                    break
                curr = curr.right

    def search(self, target):
        curr = self.root
        while curr:
            if curr.val == target:
                return True
            curr = curr.left if target < curr.val else curr.right
        return False`,
    textBasedContent: `### 📌 Deep Dive: Binary Search Tree (BST) Construction & Search Invariants

A Binary Search Tree is a hierarchical non-linear data structure where each node has at most two children, maintaining a global order property across all subtrees.

---

#### 1. The Structural Invariant
For any arbitrary node $X$ in the tree:
$$\\forall L \\in \\text{LeftSubtree}(X): \\text{value}(L) < \\text{value}(X)$$
$$\\forall R \\in \\text{RightSubtree}(X): \\text{value}(R) > \\text{value}(X)$$
Because this property holds recursively for every subtree, searching for a key mirrors the divide-and-conquer strategy of binary search on a sorted array.

---

#### 2. Traversal Invariant Theorem
* **In-Order Traversal (L $\\rightarrow$ Root $\\rightarrow$ R)**: Guaranteed to yield sorted ascending keys.
* **Pre-Order Traversal (Root $\\rightarrow$ L $\\rightarrow$ R)**: Used for tree serialization and cloning.
* **Post-Order Traversal (L $\\rightarrow$ R $\\rightarrow$ Root)**: Used for calculating subtree height and memory deletion.`,
    videoSuggestion: {
      title: "Binary Search Trees: Structure, Lookup, Insertion & Invariants",
      youtubeId: "pYT9F8_LrmM",
      url: "https://www.youtube.com/watch?v=pYT9F8_LrmM",
      channel: "CS Dojo",
      duration: "16:15",
      thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80",
      summary: "Visualizing node structures, recursive and iterative lookups, and height invariants in Binary Search Trees.",
    },
  },

  // DSA Topic 2: DFS & Lowest Common Ancestor (LCA)
  dsa_top_2: {
    keyTakeaways: [
      "In a BST, the Lowest Common Ancestor (LCA) is the first node where the paths to p and q diverge (the split point).",
      "If both p and q are smaller than current node, LCA is in the left branch.",
      "If both p and q are greater than current node, LCA is in the right branch.",
      "LCA in a BST can be solved in O(h) = O(log N) time and O(1) space iteratively!",
    ],
    commonMistakes: [
      "Searching both subtrees in a BST when the ordering property allows you to eliminate one branch entirely.",
      "Using recursive DFS which consumes O(h) stack memory instead of a simple while loop.",
    ],
    codeSnippet: `def lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Find Lowest Common Ancestor (LCA) in a BST.
    Time Complexity: O(h) = O(log N) on balanced tree
    Space Complexity: O(1) auxiliary space (Iterative)
    """
    curr = root
    while curr:
        # Both p and q are smaller -> LCA must be in left subtree
        if p.val < curr.val and q.val < curr.val:
            curr = curr.left
        # Both p and q are greater -> LCA must be in right subtree
        elif p.val > curr.val and q.val > curr.val:
            curr = curr.right
        # Split point reached: one is left, one is right (or curr is p/q)
        else:
            return curr
    return None`,
    textBasedContent: `### 📌 Deep Dive: Depth-First Search & Lowest Common Ancestor (LCA) in BST

Finding the Lowest Common Ancestor of two nodes $p$ and $q$ in a tree is one of the classic technical interview and algorithmic system design challenges.

---

#### 1. What is the Lowest Common Ancestor?
The LCA of two nodes $p$ and $q$ is defined as the lowest node in $T$ that has both $p$ and $q$ as descendants (where we allow a node to be a descendant of itself).

---

#### 2. The Split Point Theorem for BST
In an arbitrary binary tree, you must explore both subtrees. However, in a **Binary Search Tree (BST)**, the value of the root completely determines where $p$ and $q$ lie:
1. **Both on Left**: If $p.\\text{val} < \\text{curr}.\\text{val}$ and $q.\\text{val} < \\text{curr}.\\text{val}$, the LCA cannot be \`curr\` and cannot be in the right subtree. It must lie in the left subtree.
2. **Both on Right**: If $p.\\text{val} > \\text{curr}.\\text{val}$ and $q.\\text{val} > \\text{curr}.\\text{val}$, it must lie in the right subtree.
3. **The Split Point**: The instant one node is $\\le \\text{curr}.\\text{val}$ and the other is $\\ge \\text{curr}.\\text{val}$, **\`curr\` is the Lowest Common Ancestor**! Any further descent down either branch would lose one of the two targets.`,
    videoSuggestion: {
      title: "Lowest Common Ancestor in a Binary Search Tree (LeetCode 235)",
      youtubeId: "gs2LMfuOR9k",
      url: "https://www.youtube.com/watch?v=gs2LMfuOR9k",
      channel: "NeetCode",
      duration: "08:45",
      thumbnailUrl: "https://images.unsplash.com/photo-1516116211227-bbc03e3a479c?w=800&auto=format&fit=crop&q=80",
      summary: "NeetCode step-by-step walkthrough explaining the split point property and optimal O(1) space iterative LCA.",
    },
  },
};

/**
 * Fallback synthesizer for dynamically generated topics or courses
 */
export function getEnrichedTopicContent(
  topicId: string,
  topicTitle: string,
  moduleTitle?: string
): EnrichedTopicDetails {
  if (TOPIC_CONTENT_REGISTRY[topicId]) {
    return TOPIC_CONTENT_REGISTRY[topicId];
  }

  // Synthesize rich, educational content for dynamically created topic
  const cleanTitle = topicTitle.trim();
  const modTitle = moduleTitle || "Core Curriculum";
  const isJava = cleanTitle.toLowerCase().includes("java") || modTitle.toLowerCase().includes("java");

  if (isJava) {
    return {
      keyTakeaways: [
        `Mastering the foundational syntax and memory mechanics of ${cleanTitle}.`,
        "Writing clean, readable, type-safe Java code adhering to best practices.",
        "Avoiding common runtime pitfalls like NullPointerException and off-by-one loops.",
      ],
      commonMistakes: [
        "Neglecting input boundary checks and null validations in methods.",
        "Comparing objects or strings using '==' instead of '.equals()'.",
        "Deeply nesting conditional statements instead of using guard clauses.",
      ],
      codeSnippet: "",
      textBasedContent: `### ☕ Conceptual Guide: ${cleanTitle}

Welcome to this guide on **${cleanTitle}**, part of the **${modTitle}** curriculum.

---

#### 1. Definition & Core Principles
**${cleanTitle}** is a foundational concept.
* **Topic Definition**: A structured principle focusing on how systems process information, organize memory, and handle logic reliably.
* **Why it matters**: Mastering this concept allows you to build clearer mental models and understand the underlying mechanics without getting bogged down in syntax.
* **Real-World Analogy**: Think of it like a well-organized filing and indexing system where every item is cataloged by strict rules so retrieval is instantaneous and predictable.

---

#### 2. Key Conceptual Takeaways
1. **Identify Purpose**: Understand what problem this concept solves and when to apply its principles.
2. **Mental Model**: Visualize the flow of data and dependencies from start to finish.
3. **Core Terminology**: Learn the industry-standard vocabulary associated with ${cleanTitle}.`,
      videoSuggestion: {
        title: `${cleanTitle} - Complete Educational Guide`,
        youtubeId: "rfscVS0vtbw",
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTitle + " tutorial")}`,
        channel: "LearnWithAI Academy",
        duration: "15:30",
        thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
        summary: `In-depth educational guide covering the concepts, definitions, and real-world intuition for ${cleanTitle}.`,
      },
    };
  }

  return {
    keyTakeaways: [
      `Understanding the core definition and principles behind ${cleanTitle}.`,
      "Building clear mental models for conceptual clarity.",
      "Recognizing real-world applications and system behavior.",
    ],
    commonMistakes: [
      `Confusing the core definition of ${cleanTitle} with related technologies.`,
      "Overlooking basic assumptions and prerequisite principles.",
      "Focusing on memorization rather than deep conceptual intuition.",
    ],
    codeSnippet: "",
    textBasedContent: `### 📌 In-Depth Lesson: ${cleanTitle}

Welcome to this guide on **${cleanTitle}**, part of the **${modTitle}** module.

---

#### 1. Core Concepts
When working with **${cleanTitle}**, our primary goal is writing maintainable, resilient, and easy-to-read code.
* **Clarity**: Each component should have a single, well-defined responsibility.
* **Defensive Coding**: Anticipate invalid inputs, network failures, or edge cases gracefully.

---

#### 2. Step-by-Step Implementation
1. **Validate Preconditions**: Ensure data is clean and valid before performing core logic.
2. **Execute Core Logic**: Keep logic straightforward and idiomatic.
3. **Verify Edge Cases**: Check boundary conditions like empty inputs or extreme values.`,
    videoSuggestion: {
      title: `${cleanTitle} - Complete Educational Guide`,
      youtubeId: "rfscVS0vtbw",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTitle + " tutorial")}`,
      channel: "LearnWithAI Academy",
      duration: "15:30",
      thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
      summary: `In-depth video tutorial covering the theory, live coding, and practical exercises for ${cleanTitle}.`,
    },
  };
}
