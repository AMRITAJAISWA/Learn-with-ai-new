"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  Clock,
  Target,
  BookOpen,
  Sparkles,
  Check,
  Flame,
  Award,
} from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "Aarav Patel");
  const [email, setEmail] = useState(user?.email || "aarav.patel@stanford.edu");
  const [college, setCollege] = useState(user?.college || "Stanford University");
  const [educationLevel, setEducationLevel] = useState(
    user?.educationLevel || "Undergraduate (Computer Science)"
  );
  const [skillLevel, setSkillLevel] = useState(user?.skillLevel || "Intermediate");
  const [learningGoals, setLearningGoals] = useState(
    user?.learningGoals || "Prepare for Top-Tier AI & Machine Learning Engineering Roles"
  );
  const [preferredStudyDuration, setPreferredStudyDuration] = useState(
    user?.preferredStudyDuration || 60
  );
  const [preferredStudyTime, setPreferredStudyTime] = useState(
    user?.preferredStudyTime || "Evening (6:00 PM - 9:00 PM)"
  );
  const [bio, setBio] = useState(
    user?.bio || "CS sophomore passionate about neural networks, distributed systems, and building AI tools."
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      college,
      educationLevel,
      skillLevel,
      learningGoals,
      preferredStudyDuration,
      preferredStudyTime,
      bio,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
          Student Identity
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
          Student Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your academic background, target learning milestones, and study buddy matching preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav"}
              alt="Avatar"
              className="h-16 w-16 rounded-full border-2 border-slate-200 bg-sky-50 object-cover"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user?.name || name}</h2>
              <p className="text-xs text-slate-500">{user?.email || email}</p>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span>ID: {user?.id || "user_demo_123"}</span>
                <span>•</span>
                <span>Member since Sep 2026</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-center">
              <span className="flex items-center justify-center gap-1 text-xs font-black text-amber-700">
                <Flame className="h-4 w-4 fill-amber-500" />
                {user?.streakDays || 7} Days
              </span>
              <span className="block text-[9px] font-bold text-amber-600 uppercase">Streak</span>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-center">
              <span className="flex items-center justify-center gap-1 text-xs font-black text-sky-700">
                <Award className="h-4 w-4" />
                {user?.totalXP || 1250} XP
              </span>
              <span className="block text-[9px] font-bold text-sky-600 uppercase">Mastery</span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Education Level
              </label>
              <input
                type="text"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Skill Level
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs focus:border-sky-500 focus:outline-none bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Study Time
              </label>
              <input
                type="text"
                value={preferredStudyTime}
                onChange={(e) => setPreferredStudyTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Learning Goals & Target Milestone
            </label>
            <input
              type="text"
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Bio / Introduction for Study Buddies
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {savedSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <Check className="h-4 w-4" /> Changes saved successfully!
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">
                Updated profile directly syncs to Study Buddy matching.
              </span>
            )}

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-95 shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
