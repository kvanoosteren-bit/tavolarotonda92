import { NextResponse } from "next/server";
import { getOrders } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Failed to get orders:", error);
    return NextResponse.json({ orders: [] });
  }
}
