import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { getOrders } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Debug: show all blobs in the store
    const allBlobs = await list();
    const orders = await getOrders();
    return NextResponse.json({
      orders,
      debug: {
        totalBlobs: allBlobs.blobs.length,
        blobs: allBlobs.blobs.map((b) => ({
          pathname: b.pathname,
          url: b.url,
          size: b.size,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to get orders:", error);
    return NextResponse.json({ orders: [], debug: { error: String(error) } });
  }
}
