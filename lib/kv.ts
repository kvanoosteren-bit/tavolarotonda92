import { Redis } from "@upstash/redis";
import { Order } from "./types";

const TOTAL_BOTTLES = 92;
const INITIAL_STOCK = 90;
const ORDERS_KEY = "limoncello:orders";

function getRedis() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
  if (process.env.REDIS_URL) {
    const parsed = new URL(process.env.REDIS_URL);
    return new Redis({
      url: `https://${parsed.hostname}`,
      token: parsed.password,
    });
  }
  throw new Error("No Redis configured");
}

// Get all orders
export async function getOrders(): Promise<Order[]> {
  try {
    const redis = getRedis();
    const raw = await redis.get<Order[]>(ORDERS_KEY);
    if (!raw) return [];
    return raw;
  } catch (e) {
    console.error("getOrders failed:", e);
    return [];
  }
}

// Save orders array
async function saveOrders(orders: Order[]) {
  const redis = getRedis();
  await redis.set(ORDERS_KEY, orders);
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
