// orderStorage.ts
export type Order = {
  id: string;
  status: "processing" | "shipped" | "delivered" | "failed";
};

const STORAGE_KEY = "orders";

// Get all orders from localStorage
export function getOrders(): Order[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Save all orders
function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// Add a new order
export function addOrder(order: Order) {
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
}

// Update order status
export function updateOrder(id: string, status: Order["status"]) {
  const orders = getOrders();
  const updated = orders.map((o) =>
    o.id === id ? { ...o, status } : o
  );
  saveOrders(updated);
}

// Find order by ID
export function findOrder(id: string): Order | null {
  const orders = getOrders();
  return orders.find((o) => o.id === id) || null;
}

