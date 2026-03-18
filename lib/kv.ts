import { Order } from "./types";

const TOTAL_BOTTLES = 92;
const INITIAL_STOCK = 90;
const ORDERS_KEY = "limoncello:orders";

function getCredentials() {
  // Parse REDIS_URL: rediss://default:TOKEN@host:port
  if (process.env.REDIS_URL) {
    const parsed = new URL(process.env.REDIS_URL);
    return {
      url: `https://${parsed.hostname}`,
      token: parsed.password,
    };
  }
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return {
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    };
  }
  throw new Error("No Redis configured");
}

async function redis(command: string[]) {
  const { url, token } = getCredentials();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Redis error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.result;
}

// Get all orders
export async function getOrders(): Promise<Order[]> {
  try {
    const raw = await redis(["GET", ORDERS_KEY]);
    if (!raw) return [];
    const orders: Order[] = typeof raw === "string" ? JSON.parse(raw) : raw;
    return orders;
  } catch {
    return [];
  }
}

// Save orders array
async function saveOrders(orders: Order[]) {
  await redis(["SET", ORDERS_KEY, JSON.stringify(orders)]);
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
