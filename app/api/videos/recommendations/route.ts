import { NextRequest, NextResponse } from "next/server";
import { fetchEducationalVideos } from "@/lib/youtube/videoService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "Python Data Structures";
    const difficulty = searchParams.get("difficulty") || "All";
    const duration = searchParams.get("duration") || "All";

    const videos = await fetchEducationalVideos({
      query,
      difficultyFilter: difficulty,
      durationFilter: duration,
    });

    return NextResponse.json({ success: true, videos });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
