export const environment = {
  production: true,
  spoonacular: {
    apiKey: '', // Empty in production bundle - securely injected via Vercel serverless proxy
    baseUrl: '/api/proxy',
  },
};
