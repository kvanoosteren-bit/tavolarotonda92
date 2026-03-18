import { NextRequest, NextResponse } from "next/server";
import { getStock, getRedisClient, TOTAL_BOTTLES } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const available = await getStock();
    return NextResponse.json({ available, total: TOTAL_BOTTLES });
  } catch (error) {
    console.error("Failed to get stock:", error);
    // Fallback when KV is not configured
    return NextResponse.json({ available: 90, total: TOTAL_BOTTLES });
  }
}

// POST /api/stock?amount=90 to reset stock
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = parseInt(searchParams.get("amount") || "90", 10);

    if (isNaN(amount) || amount < 0 || amount > TOTAL_BOTTLES) {
      return NextResponse.json(
        { error: `Aantal moet tussen 0 en ${TOTAL_BOTTLES} zijn` },
        { status: 400 }
      );
    }

    const redis = getRedisClient();
    await redis.set("limoncello:stock", amount);

    return NextResponse.json({ success: true, available: amount, total: TOTAL_BOTTLES });
  } catch (error) {
    console.error("Reset stock failed:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
