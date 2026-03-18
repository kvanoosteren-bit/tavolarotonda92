import { NextRequest, NextResponse } from "next/server";
import { getRedisClient, TOTAL_BOTTLES } from "@/lib/kv";

export const dynamic = "force-dynamic";

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
      { error: "Kon voorraad niet resetten" },
      { status: 500 }
    );
  }
}
