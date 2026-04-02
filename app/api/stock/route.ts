import { NextResponse } from "next/server";
import { getStock, TOTAL_BOTTLES } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const available = await getStock();
    return NextResponse.json({ available, total: TOTAL_BOTTLES });
  } catch (error) {
    console.error("Failed to get stock:", error);
    return NextResponse.json({ available: 91, total: TOTAL_BOTTLES });
  }
}
