import { put, list, head } from "@vercel/blob";
import { Order } from "./types";

const TOTAL_BOTTLES = 92;
const INITIAL_STOCK = 90;
const BLOB_PATH = "limoncello-orders.json";

// Get all orders from blob storage
export async function getOrders(): Promise<Order[]> {
  try {
    // Find our blob
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (blobs.length === 0) return [];

    const blobUrl = blobs[0].url;
    const res = await fetch(blobUrl);
    if (!res.ok) return [];
    const orders: Order[] = await res.json();
    return orders;
  } catch (e) {
    console.error("getOrders failed:", e);
    return [];
  }
}

// Save orders array to blob
async function saveOrders(orders: Order[]) {
  // Delete existing blobs with this name
  const { blobs } = await list({ prefix: BLOB_PATH });

  // Upload new version (put overwrites if same pathname)
  await put(BLOB_PATH, JSON.stringify(orders), {
    access: "public",
    addRandomSuffix: false,
  });

  // Clean up old versions
  if (blobs.length > 0) {
    const { del } = await import("@vercel/blob");
    for (const blob of blobs) {
      try { await del(blob.url); } catch {}
    }
  }
}

// Get stock based on orders
export async function getStock(): Promise<number> {
  const orders = await getOrders();
  const sold = orders.reduce((sum, o) => sum + o.aantal, 0);
  return INITIAL_STOCK - sold;
}

// Add order and return new stock
export async function addOrder(order: Order): Promise<number> {
  const orders = await getOrders();
  orders.push(order);
  await saveOrders(orders);
  const sold = orders.reduce((sum, o) => sum + o.aantal, 0);
  return INITIAL_STOCK - sold;
}

// Delete order by id and return new stock
export async function deleteOrder(orderId: string): Promise<number> {
  const orders = await getOrders();
  const filtered = orders.filter((o) => o.id !== orderId);
  await saveOrders(filtered);
  const sold = filtered.reduce((sum, o) => sum + o.aantal, 0);
  return INITIAL_STOCK - sold;
}

export { TOTAL_BOTTLES, INITIAL_STOCK };
