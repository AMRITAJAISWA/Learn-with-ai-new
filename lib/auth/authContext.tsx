"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfileData } from "@/lib/db/store";
import {
  getAllRegisteredUsers,
  saveRegisteredUser,
  findUserByEmail,
  RegisteredAccount,
  INITIAL_REGISTERED_USERS,
} from "@/lib/db/connectionStore";

interface AuthContextType {
  user: UserProfileData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  allRegisteredUsers: RegisteredAccount[];
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (details: {
    name: string;
    email: string;
    password?: string;
    college?: string;
    educationLevel?: string;
    targetSubjects?: string[];
  }) => { success: boolean; error?: string };
  loginAsDemo: () => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfileData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allRegisteredUsers, setAllRegisteredUsers] = useState<RegisteredAccount[]>(INITIAL_REGISTERED_USERS);

  useEffect(() => {
    // Load registered accounts
    const accounts = getAllRegisteredUsers();
    setAllRegisteredUsers(accounts);

    // Check if user session exists in localStorage
    const isExplicitlyLoggedOut =
      typeof window !== "undefined" &&
      localStorage.getItem("learnwithai_logged_out") === "true";
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("learnwithai_session")
        : null;

    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    } else if (!isExplicitlyLoggedOut) {
      // First visit before user ever signed out - default to Aarav
      const defaultUser = accounts[0] || INITIAL_REGISTERED_USERS[0];
      setUser(defaultUser);
      localStorage.setItem("learnwithai_session", JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  const loginAsDemo = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("learnwithai_logged_out");
    }
    const accounts = getAllRegisteredUsers();
    const demoUser = accounts[0] || INITIAL_REGISTERED_USERS[0];
    setUser(demoUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("learnwithai_session", JSON.stringify(demoUser));
    }
  };

  const login = (email: string, password?: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("learnwithai_logged_out");
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = findUserByEmail(cleanEmail);

    if (existing) {
      setUser(existing);
      if (typeof window !== "undefined") {
        localStorage.setItem("learnwithai_session", JSON.stringify(existing));
      }
      return { success: true };
    }

    // If new email provided, automatically create a new student account
    const cleanName = cleanEmail.split("@")[0].replace(/[._]/g, " ");
    const formattedName =
      cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    const newUser: RegisteredAccount = {
      id: "user_" + Date.now(),
      name: formattedName,
      email: cleanEmail,
      password: password || "password123",
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formattedName)}`,
      educationLevel: "Undergraduate Student",
      college: "Stanford University",
      targetSubjects: ["Data Science", "Algorithms", "Machine Learning"],
      skillLevel: "Intermediate",
      learningGoals: "Master Full-Stack AI & Engineering",
      preferredStudyDuration: 60,
      preferredStudyTime: "Evening (6:00 PM - 9:00 PM)",
      interests: ["Python", "Neural Networks", "Web Systems"],
      streakDays: 1,
      totalXP: 100,
      bio: "Passionate student learning with AI.",
    };

    saveRegisteredUser(newUser);
    const updatedUsers = getAllRegisteredUsers();
    setAllRegisteredUsers(updatedUsers);
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("learnwithai_session", JSON.stringify(newUser));
    }

    return { success: true };
  };

  const register = (details: {
    name: string;
    email: string;
    password?: string;
    college?: string;
    educationLevel?: string;
    targetSubjects?: string[];
  }) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("learnwithai_logged_out");
    }

    const cleanEmail = details.email.trim().toLowerCase();
    const cleanName = details.name.trim();

    const newUser: RegisteredAccount = {
      id: "user_" + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: details.password || "password123",
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      educationLevel: details.educationLevel || "Undergraduate Student",
      college: details.college || "University Student",
      targetSubjects: details.targetSubjects || ["Computer Science", "Artificial Intelligence"],
      skillLevel: "Intermediate",
      learningGoals: "Personalized AI Mastery and Peer Collaboration",
      preferredStudyDuration: 60,
      preferredStudyTime: "Evening (6:00 PM - 9:00 PM)",
      interests: ["AI", "Software Engineering", "Mathematics"],
      streakDays: 1,
      totalXP: 150,
      bio: `Student at ${details.college || "University"} exploring AI and peer learning.`,
    };

    saveRegisteredUser(newUser);
    const updatedUsers = getAllRegisteredUsers();
    setAllRegisteredUsers(updatedUsers);
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("learnwithai_session", JSON.stringify(newUser));
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("learnwithai_session");
      localStorage.setItem("learnwithai_logged_out", "true");
      window.location.href = "/login";
    }
  };

  const updateProfile = (updated: Partial<UserProfileData>) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updated };
      if (typeof window !== "undefined") {
        localStorage.setItem("learnwithai_session", JSON.stringify(merged));
        saveRegisteredUser(merged as RegisteredAccount);
        setAllRegisteredUsers(getAllRegisteredUsers());
      }
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        allRegisteredUsers,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

