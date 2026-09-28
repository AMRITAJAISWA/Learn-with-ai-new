"use client";

import { UserProfileData, StudyBuddyData } from "./store";

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar: string;
  senderCollege: string;
  senderSubjects: string[];
  receiverId: string;
  receiverEmail: string;
  receiverName: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
}

export interface RegisteredAccount extends UserProfileData {
  password?: string;
}

export const INITIAL_REGISTERED_USERS: RegisteredAccount[] = [
  {
    id: "user_aarav",
    name: "Aarav Patel",
    email: "aarav@stanford.edu",
    password: "password123",
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
  },
  {
    id: "buddy_sarah",
    name: "Sarah Lin",
    email: "sarah@mit.edu",
    password: "password123",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    educationLevel: "Junior (Electrical Eng & CS)",
    college: "MIT",
    targetSubjects: ["Python for Data Science", "Machine Learning"],
    skillLevel: "Intermediate",
    learningGoals: "Master Deep Learning & AI Research",
    preferredStudyDuration: 60,
    preferredStudyTime: "Evening (6:00 PM - 9:00 PM)",
    interests: ["Deep Learning", "PyTorch", "Computer Vision", "Transformers"],
    streakDays: 5,
    totalXP: 980,
    bio: "Focusing on vision transformers and self-supervised representations. Looking for study partners to write research summaries.",
  },
  {
    id: "buddy_david",
    name: "David Kim",
    email: "david@berkeley.edu",
    password: "password123",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    educationLevel: "Undergraduate (Computer Science)",
    college: "UC Berkeley",
    targetSubjects: ["Data Structures & Algorithms", "Systems"],
    skillLevel: "Intermediate",
    learningGoals: "FAANG Interview Preparation",
    preferredStudyDuration: 90,
    preferredStudyTime: "Night (8:00 PM - 11:00 PM)",
    interests: ["Algorithms", "Tree Traversal", "LeetCode Hard", "Distributed DBs"],
    streakDays: 12,
    totalXP: 1840,
    bio: "Practicing graph algorithms and dynamic programming. Always up for a peer mock interview session.",
  },
  {
    id: "buddy_amina",
    name: "Amina Al-Mansoor",
    email: "amina@uw.edu",
    password: "password123",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina",
    educationLevel: "Master's (Software Engineering)",
    college: "University of Washington",
    targetSubjects: ["Full Stack Web Development", "Cloud Architecture"],
    skillLevel: "Beginner",
    learningGoals: "Build high-throughput SaaS web apps",
    preferredStudyDuration: 45,
    preferredStudyTime: "Morning (8:00 AM - 10:00 AM)",
    interests: ["Next.js", "React", "Prisma", "PostgreSQL", "Tailwind CSS"],
    streakDays: 3,
    totalXP: 450,
    bio: "Switching from electrical engineering into modern web platforms. Looking for collaborative partners to build projects.",
  },
  {
    id: "buddy_marcus",
    name: "Marcus Vance",
    email: "marcus@imperial.ac.uk",
    password: "password123",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    educationLevel: "Bachelor's (Applied Mathematics)",
    college: "Imperial College London",
    targetSubjects: ["Python for Data Science", "Linear Algebra"],
    skillLevel: "Advanced",
    learningGoals: "Quantitative Finance & Statistical Modeling",
    preferredStudyDuration: 60,
    preferredStudyTime: "Afternoon (2:00 PM - 5:00 PM)",
    interests: ["NumPy", "Probability", "Vectorized Calculus", "Options Pricing"],
    streakDays: 8,
    totalXP: 1420,
    bio: "Math major passionate about high performance computational math in Python.",
  },
];

const INITIAL_REQUESTS: ConnectionRequest[] = [
  {
    id: "req_demo_1",
    senderId: "buddy_sarah",
    senderName: "Sarah Lin",
    senderEmail: "sarah@mit.edu",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    senderCollege: "MIT",
    senderSubjects: ["Python for Data Science", "Machine Learning"],
    receiverId: "user_aarav",
    receiverEmail: "aarav@stanford.edu",
    receiverName: "Aarav Patel",
    status: "PENDING",
    createdAt: "10 mins ago",
  },
];

// Helper to access LocalStorage safely
function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getAllRegisteredUsers(): RegisteredAccount[] {
  if (!isClient()) return INITIAL_REGISTERED_USERS;
  try {
    const raw = localStorage.getItem("learnwithai_all_users");
    if (!raw) {
      localStorage.setItem("learnwithai_all_users", JSON.stringify(INITIAL_REGISTERED_USERS));
      return INITIAL_REGISTERED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem("learnwithai_all_users", JSON.stringify(INITIAL_REGISTERED_USERS));
      return INITIAL_REGISTERED_USERS;
    }
    return parsed;
  } catch {
    return INITIAL_REGISTERED_USERS;
  }
}

export function saveRegisteredUser(account: RegisteredAccount): RegisteredAccount {
  if (!isClient()) return account;
  const users = getAllRegisteredUsers();
  const existingIdx = users.findIndex(
    (u) => u.email.toLowerCase() === account.email.toLowerCase()
  );
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...account };
  } else {
    users.push(account);
  }
  localStorage.setItem("learnwithai_all_users", JSON.stringify(users));
  return account;
}

export function findUserByEmail(email: string): RegisteredAccount | undefined {
  const users = getAllRegisteredUsers();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function getAllConnectionRequests(): ConnectionRequest[] {
  if (!isClient()) return INITIAL_REQUESTS;
  try {
    const raw = localStorage.getItem("learnwithai_connection_requests");
    if (!raw) {
      localStorage.setItem(
        "learnwithai_connection_requests",
        JSON.stringify(INITIAL_REQUESTS)
      );
      return INITIAL_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_REQUESTS;
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveAllConnectionRequests(requests: ConnectionRequest[]) {
  if (!isClient()) return;
  localStorage.setItem("learnwithai_connection_requests", JSON.stringify(requests));
  window.dispatchEvent(new CustomEvent("connection-requests-updated", { detail: requests }));
}

export function sendConnectionRequest(
  sender: UserProfileData,
  receiver: { id: string; name: string; email: string; college?: string; avatarUrl?: string }
): ConnectionRequest {
  const requests = getAllConnectionRequests();
  const existing = requests.find(
    (r) =>
      ((r.senderEmail.toLowerCase() === sender.email.toLowerCase() &&
        r.receiverEmail.toLowerCase() === receiver.email.toLowerCase()) ||
        (r.senderEmail.toLowerCase() === receiver.email.toLowerCase() &&
          r.receiverEmail.toLowerCase() === sender.email.toLowerCase()))
  );

  if (existing) {
    existing.status = "PENDING";
    existing.senderId = sender.id;
    existing.senderName = sender.name;
    existing.senderEmail = sender.email;
    existing.senderAvatar = sender.avatarUrl;
    existing.senderCollege = sender.college;
    existing.senderSubjects = sender.targetSubjects || [];
    existing.receiverId = receiver.id;
    existing.receiverName = receiver.name;
    existing.receiverEmail = receiver.email;
    existing.createdAt = "Just now";
    saveAllConnectionRequests(requests);
    return existing;
  }

  const newReq: ConnectionRequest = {
    id: `req_${Date.now()}`,
    senderId: sender.id,
    senderName: sender.name,
    senderEmail: sender.email,
    senderAvatar: sender.avatarUrl,
    senderCollege: sender.college,
    senderSubjects: sender.targetSubjects || [],
    receiverId: receiver.id,
    receiverName: receiver.name,
    receiverEmail: receiver.email,
    status: "PENDING",
    createdAt: "Just now",
  };

  requests.unshift(newReq);
  saveAllConnectionRequests(requests);
  return newReq;
}

export function acceptConnectionRequest(requestId: string): ConnectionRequest | null {
  const requests = getAllConnectionRequests();
  const target = requests.find((r) => r.id === requestId);
  if (!target) return null;

  target.status = "ACCEPTED";
  saveAllConnectionRequests(requests);
  return target;
}

export function declineConnectionRequest(requestId: string): ConnectionRequest | null {
  const requests = getAllConnectionRequests();
  const target = requests.find((r) => r.id === requestId);
  if (!target) return null;

  target.status = "DECLINED";
  saveAllConnectionRequests(requests);
  return target;
}

export function getIncomingRequestsForUser(userEmailOrId: string): ConnectionRequest[] {
  const requests = getAllConnectionRequests();
  const key = userEmailOrId.toLowerCase();
  return requests.filter(
    (r) =>
      r.status === "PENDING" &&
      (r.receiverEmail.toLowerCase() === key || r.receiverId.toLowerCase() === key)
  );
}

export function getConnectionStatusBetween(
  currentUser: UserProfileData,
  otherUserEmailOrId: string
): {
  status: "CONNECTED" | "PENDING_SENT" | "PENDING_RECEIVED" | "NONE";
  requestId?: string;
} {
  const requests = getAllConnectionRequests();
  const myEmail = currentUser.email.toLowerCase();
  const myId = currentUser.id.toLowerCase();
  const otherKey = otherUserEmailOrId.toLowerCase();

  // Find any request involving both
  const match = requests.find(
    (r) =>
      (r.senderEmail.toLowerCase() === myEmail &&
        (r.receiverEmail.toLowerCase() === otherKey || r.receiverId.toLowerCase() === otherKey)) ||
      (r.receiverEmail.toLowerCase() === myEmail &&
        (r.senderEmail.toLowerCase() === otherKey || r.senderId.toLowerCase() === otherKey)) ||
      (r.senderId.toLowerCase() === myId &&
        (r.receiverEmail.toLowerCase() === otherKey || r.receiverId.toLowerCase() === otherKey)) ||
      (r.receiverId.toLowerCase() === myId &&
        (r.senderEmail.toLowerCase() === otherKey || r.senderId.toLowerCase() === otherKey))
  );

  if (!match) return { status: "NONE" };
  if (match.status === "ACCEPTED") return { status: "CONNECTED", requestId: match.id };
  if (match.status === "DECLINED") return { status: "NONE", requestId: match.id };

  // Pending
  if (
    match.senderEmail.toLowerCase() === myEmail ||
    match.senderId.toLowerCase() === myId
  ) {
    return { status: "PENDING_SENT", requestId: match.id };
  } else {
    return { status: "PENDING_RECEIVED", requestId: match.id };
  }
}

// -------------------------------------------------------------
// Real Peer-to-Peer Messaging (Zero Automated Replies)
// -------------------------------------------------------------

export interface PeerMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  receiverAvatar?: string;
  content: string;
  timestamp: string;
  createdAt: number;
}

export function getAllPeerMessages(): PeerMessage[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem("learnwithai_peer_messages");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAllPeerMessages(messages: PeerMessage[]) {
  if (!isClient()) return;
  localStorage.setItem("learnwithai_peer_messages", JSON.stringify(messages));
  window.dispatchEvent(new CustomEvent("peer-messages-updated", { detail: messages }));
}

export function sendPeerMessage(
  sender: { id: string; name: string; email: string; avatarUrl?: string },
  receiver: { id: string; name: string; email: string; avatarUrl?: string },
  content: string
): PeerMessage {
  const messages = getAllPeerMessages();
  const newMsg: PeerMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    senderId: sender.id,
    senderName: sender.name,
    senderEmail: sender.email,
    senderAvatar: sender.avatarUrl,
    receiverId: receiver.id,
    receiverName: receiver.name,
    receiverEmail: receiver.email,
    receiverAvatar: receiver.avatarUrl,
    content: content.trim(),
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    createdAt: Date.now(),
  };

  messages.push(newMsg);
  saveAllPeerMessages(messages);
  return newMsg;
}

export function getPeerMessagesBetween(
  userA: { id?: string; email?: string },
  userB: { id?: string; email?: string }
): PeerMessage[] {
  const all = getAllPeerMessages();
  const aId = (userA.id || "").toLowerCase().trim();
  const aEmail = (userA.email || "").toLowerCase().trim();
  const bId = (userB.id || "").toLowerCase().trim();
  const bEmail = (userB.email || "").toLowerCase().trim();

  return all
    .filter((m) => {
      const sId = (m.senderId || "").toLowerCase().trim();
      const sEmail = (m.senderEmail || "").toLowerCase().trim();
      const rId = (m.receiverId || "").toLowerCase().trim();
      const rEmail = (m.receiverEmail || "").toLowerCase().trim();

      const isAtoB =
        ((aId && sId === aId) || (aEmail && sEmail === aEmail)) &&
        ((bId && rId === bId) || (bEmail && rEmail === bEmail));

      const isBtoA =
        ((bId && sId === bId) || (bEmail && sEmail === bEmail)) &&
        ((aId && rId === aId) || (aEmail && rEmail === aEmail));

      return isAtoB || isBtoA;
    })
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function clearPeerMessagesBetween(
  userA: { id?: string; email?: string },
  userB: { id?: string; email?: string }
) {
  const all = getAllPeerMessages();
  const aId = (userA.id || "").toLowerCase().trim();
  const aEmail = (userA.email || "").toLowerCase().trim();
  const bId = (userB.id || "").toLowerCase().trim();
  const bEmail = (userB.email || "").toLowerCase().trim();

  const filtered = all.filter((m) => {
    const sId = (m.senderId || "").toLowerCase().trim();
    const sEmail = (m.senderEmail || "").toLowerCase().trim();
    const rId = (m.receiverId || "").toLowerCase().trim();
    const rEmail = (m.receiverEmail || "").toLowerCase().trim();

    const isAtoB =
      ((aId && sId === aId) || (aEmail && sEmail === aEmail)) &&
      ((bId && rId === bId) || (bEmail && rEmail === bEmail));

    const isBtoA =
      ((bId && sId === bId) || (bEmail && sEmail === bEmail)) &&
      ((aId && rId === aId) || (aEmail && rEmail === aEmail));

    return !(isAtoB || isBtoA);
  });

  saveAllPeerMessages(filtered);
}
