export const config = {
  jwtSecret: 'super-secret-key-12345',
  apiKey: 'sk_live_abc123xyz789',
  databaseUrl: 'sqlite://localhost/app.db',
  stripeSecret: 'sk_test_51234567890abcdef',
  port: process.env.PORT || 3000,
};

export default config;
