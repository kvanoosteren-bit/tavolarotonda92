import { put, list, head } from "@vercel/blob";
import { Order } from "./types";

const TOTAL_BOTTLES = 92;
const INITIAL_STOCK = 90;
const BLOB_PATH = "limoncello-orders.json";

// Keep track of the blob URL after writing
let lastBlobUrl: string | null = null;

// Get all orders from blob storage
export async function getOrders(): Promise<Order[]> {
  try {
    // First try: list blobs to find our file
    const { blobs } = await list({ prefix: BLOB_PATH });
    console.log(`[blob] list returned ${blobs.length} blobs`);

    if (blobs.length === 0) return [];

    const blob = blobs[0];
    console.log(`[blob] found blob: url=${blob.url}, hasDownloadUrl=${"downloadUrl" in blob}`);

    // Try downloadUrl first, fall back to url
    const fetchUrl = blob.downloadUrl || blob.url;
    const res = await fetch(fetchUrl);
    console.log(`[blob] fetch status: ${res.status}`);

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
  const result = await put(BLOB_PATH, JSON.stringify(orders), {
    access: "private",
    addRandomSuffix: false,
  });
  lastBlobUrl = result.url;
  console.log(`[blob] saved orders, url=${result.url}`);
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
