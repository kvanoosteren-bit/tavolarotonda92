import { Redis } from "@upstash/redis";
import { Order } from "./types";

const STOCK_KEY = "limoncello:stock";
const ORDERS_KEY = "limoncello:orders";
const TOTAL_BOTTLES = 92;
const INITIAL_STOCK = 90;

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

export async function getStock(): Promise<number> {
  const redis = getRedis();
  const stock = await redis.get<number>(STOCK_KEY);
  if (stock === null || stock === undefined) {
    await redis.set(STOCK_KEY, INITIAL_STOCK);
    return INITIAL_STOCK;
  }
  return Number(stock);
}

export async function decrementStock(amount: number): Promise<number | null> {
  const redis = getRedis();
  const current = await getStock();
  console.log(`[stock] Current: ${current}, Requested: ${amount}`);

  if (current < amount) {
    console.log(`[stock] Not enough stock`);
    return null;
  }

  const newStock = current - amount;
  await redis.set(STOCK_KEY, newStock);
  console.log(`[stock] Updated to: ${newStock}`);

  return newStock;
}

export async function saveOrder(order: Order): Promise<void> {
  const redis = getRedis();
  await redis.set(`limoncello:order:${order.id}`, JSON.stringify(order));
  await redis.lpush(ORDERS_KEY, JSON.stringify(order));
}

export { TOTAL_BOTTLES };
