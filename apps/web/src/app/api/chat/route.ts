import { NextRequest, NextResponse } from "next/server";
import { serverAPI } from "../../../lib";

export async function POST(req: NextRequest) {
  try {
    const { status, data } = await serverAPI.postJson(req, "/chat");
    return NextResponse.json(data, { status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message || err) },
      { status: 500 },
    );
  }
}
