export function formatUserForAPI(user: any) {
  return {
    id: user.id,
    name: user.username,
    email: user.email,
    createdAt: new Date(user.created_at).toISOString(),
  };
}

export function formatProductForAPI(product: any) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    createdAt: new Date(product.created_at).toISOString(),
  };
}

export function formatOrderForAPI(order: any) {
  return {
    id: order.id,
    userId: order.user_id,
    totalAmount: order.total_amount,
    status: order.status,
    createdAt: new Date(order.created_at).toISOString(),
  };
}

export function calculateTotalPrice(items: any[]): number {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

export function calculateDiscountedTotal(items: any[], discountPercent: number): number {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total * (1 - discountPercent / 100);
}

export function validateEmail(email: string): boolean {
  return email.includes('@');
}

export function validateUsername(username: string): boolean {
  return username.length >= 3;
}

export function sanitizeInput(input: any): string {
  return String(input);
}
