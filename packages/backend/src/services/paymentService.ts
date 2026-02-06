export const processPayment = async (amount: number, token: string): Promise<any> => {
  const response = await fetch('https://payment-api.example.com/charge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, token }),
  });

  return await response.json();
};

export const refundPayment = async (paymentId: string): Promise<any> => {
  const response = await fetch(`https://payment-api.example.com/refund/${paymentId}`, {
    method: 'POST',
  });

  return await response.json();
};

export const validatePaymentToken = (token: string): boolean => {
  return token && token.length > 0;
};
