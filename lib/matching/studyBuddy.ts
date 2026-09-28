import { StudyBuddyData, UserProfileData } from "@/lib/db/store";

export interface MatchEvaluation {
  buddy: StudyBuddyData;
  score: number;
  matchReasons: string[];
}

export function calculateStudyBuddyMatch(
  user: UserProfileData,
  buddy: StudyBuddyData
): MatchEvaluation {
  let score = 50; // baseline
  const reasons: string[] = [];

  // 1. Same Course / Target Subject (+18%)
  const hasCommonCourse = buddy.courses.some((c) =>
    user.targetSubjects.some(
      (s) =>
        c.toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes(c.toLowerCase())
    )
  );
  if (hasCommonCourse) {
    score += 18;
    reasons.push("Enrolled in shared courses / subjects");
  }

  // 2. Skill Level compatibility (+12%)
  if (user.skillLevel.toLowerCase() === buddy.skillLevel.toLowerCase()) {
    score += 12;
    reasons.push(`Identical skill level (${user.skillLevel})`);
  } else {
    score += 6; // adjacent skill levels
  }

  // 3. Compatible Schedule (+10%)
  const userTime = user.preferredStudyTime.toLowerCase();
  const buddyTime = buddy.preferredStudyTime.toLowerCase();
  if (
    (userTime.includes("evening") && buddyTime.includes("evening")) ||
    (userTime.includes("morning") && buddyTime.includes("morning")) ||
    (userTime.includes("night") && buddyTime.includes("night"))
  ) {
    score += 10;
    reasons.push("Overlapping preferred study schedule");
  }

  // 4. Common Interests (+10%)
  const commonInterests = buddy.interests.filter((i) =>
    user.interests.some(
      (ui) =>
        ui.toLowerCase().includes(i.toLowerCase()) ||
        i.toLowerCase().includes(ui.toLowerCase())
    )
  );
  if (commonInterests.length > 0) {
    score += Math.min(commonInterests.length * 4, 10);
    reasons.push(`Shared interests: ${commonInterests.slice(0, 2).join(", ")}`);
  }

  // Cap score at 99%
  const finalScore = Math.min(Math.max(score, 60), 99);

  return {
    buddy: {
      ...buddy,
      compatibilityPct: finalScore,
    },
    score: finalScore,
    matchReasons: reasons,
  };
}
