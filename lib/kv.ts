import { kv } from "@vercel/kv";
import { Order } from "./types";

const STOCK_KEY = "limoncello:stock";
const ORDERS_KEY = "limoncello:orders";
const TOTAL_BOTTLES = 92;
const INITIAL_STOCK = 90;

export async function getStock(): Promise<number> {
  const stock = await kv.get<number>(STOCK_KEY);
  if (stock === null) {
    await kv.set(STOCK_KEY, INITIAL_STOCK);
    return INITIAL_STOCK;
  }
  return stock;
}

export async function decrementStock(amount: number): Promise<number | null> {
  // Use a watch/multi pattern for atomicity
  const current = await getStock();
  if (current < amount) {
    return null;
  }

  const newStock = current - amount;

  // Use atomic set with check - Vercel KV doesn't support WATCH,
  // so we use DECRBY and check the result
  const result = await kv.decrby(STOCK_KEY, amount);

  // If result went negative, we have a race condition - revert
  if (result < 0) {
    await kv.incrby(STOCK_KEY, amount);
    return null;
  }

  return result;
}

export async function saveOrder(order: Order): Promise<void> {
  await kv.set(`limoncello:order:${order.id}`, JSON.stringify(order));
  await kv.lpush(ORDERS_KEY, JSON.stringify(order));
}

export { TOTAL_BOTTLES };
