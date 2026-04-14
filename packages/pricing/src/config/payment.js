// Payment configuration
export const payment = {
  baseUrl: process.env.CHAPA_BASE_URL || "https://api.chapa.co",
  secretKey: process.env.CHAPA_SECRET_KEY,
  currency: process.env.CHAPA_CURRENCY || "ETB",
  callbackUrl:
    process.env.CHAPA_CALLBACK_URL ||
    "http://localhost:5000/api/v1/payment/notify",
  returnUrl: process.env.CHAPA_RETURN_URL || "http://localhost:3000/dashboard",
};

export default payment;
