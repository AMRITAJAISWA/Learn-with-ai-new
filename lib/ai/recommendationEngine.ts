export interface RecommendationContext {
  learningGoal: string;
  skillLevel: string;
  completedTopicCount: number;
  weakTopics: string[];
  recentQuizScore?: number;
  studyStreak: number;
}

export interface RecommendationInsight {
  type: "REVISION_URGENT" | "NEXT_STEP" | "STREAK_CELEBRATION" | "STUDY_BUDDY";
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
}

export function generatePersonalizedInsights(
  ctx: RecommendationContext
): RecommendationInsight[] {
  const insights: RecommendationInsight[] = [];

  if (ctx.weakTopics && ctx.weakTopics.length > 0) {
    const primaryWeak = ctx.weakTopics[0];
    insights.push({
      type: "REVISION_URGENT",
      title: `Recommended Revision: ${primaryWeak}`,
      description: `Based on your recent diagnostic quiz results, revising ${primaryWeak} now will strengthen your mental model before advancing to complex subtopics.`,
      actionText: "Review Now",
      actionHref: "/revision",
    });
  } else {
    insights.push({
      type: "NEXT_STEP",
      title: "Strong Performance on Core Topics",
      description: `You have completed ${ctx.completedTopicCount} topics with high accuracy. Ready to tackle advanced modules?`,
      actionText: "Continue Course",
      actionHref: "/courses",
    });
  }

  if (ctx.studyStreak >= 5) {
    insights.push({
      type: "STREAK_CELEBRATION",
      title: `🔥 ${ctx.studyStreak}-Day Learning Streak!`,
      description: "Consistent daily deliberate practice is yielding compound knowledge gains. +100 XP gained this week!",
      actionText: "View Progress",
      actionHref: "/progress",
    });
  }

  insights.push({
    type: "STUDY_BUDDY",
    title: "High-Compatibility Study Buddies Active",
    description: `Sarah Lin and David Kim are also studying ${ctx.learningGoal.split(" ")[0] || "Data Science"} today with compatible evening schedules.`,
    actionText: "Connect with Peers",
    actionHref: "/study-buddies",
  });

  return insights;
}
