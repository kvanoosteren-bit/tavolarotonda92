import { put, list } from "@vercel/blob";
import { Order } from "./types";

const TOTAL_BOTTLES = 92;
const INITIAL_STOCK = 91;
const BLOB_PATH = "limoncello-orders.json";

// Get all orders from blob storage
export async function getOrders(): Promise<Order[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (blobs.length === 0) return [];

    const blob = blobs[0];
    const fetchUrl = blob.downloadUrl || blob.url;

    // Cache-bust to always get fresh data
    const url = new URL(fetchUrl);
    url.searchParams.set("t", Date.now().toString());

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("getOrders failed:", e);
    return [];
  }
}

// Save orders array to blob
async function saveOrders(orders: Order[]) {
  await put(BLOB_PATH, JSON.stringify(orders), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
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
