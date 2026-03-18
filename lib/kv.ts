import { kv } from "@vercel/kv";
import { Order } from "./types";

const STOCK_KEY = "limoncello:stock";
const ORDERS_KEY = "limoncello:orders";
const TOTAL_BOTTLES = 92;
const INITIAL_STOCK = 90;

export async function getStock(): Promise<number> {
  const stock = await kv.get<number>(STOCK_KEY);
  if (stock === null || stock === undefined) {
    await kv.set(STOCK_KEY, INITIAL_STOCK);
    return INITIAL_STOCK;
  }
  return Number(stock);
}

export async function decrementStock(amount: number): Promise<number | null> {
  // Get current stock
  const current = await getStock();
  console.log(`[stock] Current: ${current}, Requested: ${amount}`);

  if (current < amount) {
    console.log(`[stock] Not enough stock`);
    return null;
  }

  // Simple set with new value
  const newStock = current - amount;
  await kv.set(STOCK_KEY, newStock);
  console.log(`[stock] Updated to: ${newStock}`);

  return newStock;
}

export async function saveOrder(order: Order): Promise<void> {
  await kv.set(`limoncello:order:${order.id}`, JSON.stringify(order));
  await kv.lpush(ORDERS_KEY, JSON.stringify(order));
}

export { TOTAL_BOTTLES };
