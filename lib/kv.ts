import { put, list, del } from "@vercel/blob";
import { Order } from "./types";

const TOTAL_BOTTLES = 92;
const INITIAL_STOCK = 90;
const BLOB_PATH = "limoncello-orders.json";

// Get all orders from blob storage
export async function getOrders(): Promise<Order[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (blobs.length === 0) return [];

    // Private blobs need downloadUrl
    const blob = blobs[0];
    const res = await fetch(blob.downloadUrl);
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
  // Upload new version
  await put(BLOB_PATH, JSON.stringify(orders), {
    access: "private",
    addRandomSuffix: false,
  });
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
