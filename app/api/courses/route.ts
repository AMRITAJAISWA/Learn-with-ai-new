import { NextResponse } from "next/server";
import { store } from "@/lib/db/store";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      courses: store.courses,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
