import { createClient } from "redis";
import { Order } from "./types";

const TOTAL_BOTTLES = 92;
const INITIAL_STOCK = 90;
const ORDERS_KEY = "limoncello:orders";

async function getRedis() {
  const client = createClient({ url: process.env.REDIS_URL });
  await client.connect();
  return client;
}

// Get all orders
export async function getOrders(): Promise<Order[]> {
  const redis = await getRedis();
  try {
    const raw = await redis.get(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("getOrders failed:", e);
    return [];
  } finally {
    await redis.disconnect();
  }
}

// Save orders array
async function saveOrders(orders: Order[]) {
  const redis = await getRedis();
  try {
    await redis.set(ORDERS_KEY, JSON.stringify(orders));
  } finally {
    await redis.disconnect();
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
  const redis = await getRedis();
  try {
    const raw = await redis.get(ORDERS_KEY);
    const orders: Order[] = raw ? JSON.parse(raw) : [];
    orders.push(order);
    await redis.set(ORDERS_KEY, JSON.stringify(orders));
    const sold = orders.reduce((sum, o) => sum + o.aantal, 0);
    return INITIAL_STOCK - sold;
  } finally {
    await redis.disconnect();
  }
}

// Delete order by id and return new stock
export async function deleteOrder(orderId: string): Promise<number> {
  const redis = await getRedis();
  try {
    const raw = await redis.get(ORDERS_KEY);
    const orders: Order[] = raw ? JSON.parse(raw) : [];
    const filtered = orders.filter((o) => o.id !== orderId);
    await redis.set(ORDERS_KEY, JSON.stringify(filtered));
    const sold = filtered.reduce((sum, o) => sum + o.aantal, 0);
    return INITIAL_STOCK - sold;
  } finally {
    await redis.disconnect();
  }
}

export { TOTAL_BOTTLES, INITIAL_STOCK };
