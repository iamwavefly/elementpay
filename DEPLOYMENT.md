# ElementPay - Production Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- WalletConnect Project ID
- Secure webhook secret

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Required: WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Required: Webhook Secret (generate a secure random string)
WEBHOOK_SECRET=your_secure_webhook_secret_here

# Optional: API Base URL
NEXT_PUBLIC_API_BASE_URL=

# Environment
NODE_ENV=production
```

## Getting WalletConnect Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create an account and new project
3. Copy the Project ID to your environment variables

## Generating Webhook Secret

Generate a secure random string for webhook signature verification:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Build and Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

## Production Checklist

- [ ] Set secure `WEBHOOK_SECRET` (not the default value)
- [ ] Configure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- [ ] Test webhook signature verification
- [ ] Verify all API endpoints work correctly
- [ ] Test wallet connection flow
- [ ] Test order creation and status updates
- [ ] Configure proper CORS if needed
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting if needed

## Security Considerations

- Never commit `.env.local` to version control
- Use strong, unique webhook secrets
- Implement proper rate limiting in production
- Monitor for suspicious activity
- Keep dependencies updated
- Use HTTPS in production

## API Endpoints

- `POST /api/mock/orders/create` - Create new order
- `GET /api/mock/orders/[order_id]` - Get order status
- `POST /api/webhooks/elementpay` - Webhook endpoint

## Webhook Testing

Test webhook signature verification:

```bash
# Generate test signature
node -e "
const crypto = require('crypto');
const secret = 'your_webhook_secret';
const timestamp = Math.floor(Date.now() / 1000);
const body = JSON.stringify({type: 'order.settled', data: {order_id: 'ord_test123', status: 'settled'}});
const payload = \`\${timestamp}.\${body}\`;
const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64');
console.log(\`t=\${timestamp},v1=\${signature}\`);
"

# Test webhook
curl -X POST http://localhost:3000/api/webhooks/elementpay \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: t=1234567890,v1=generated_signature" \
  -d '{"type":"order.settled","data":{"order_id":"ord_test123","status":"settled"}}'
```
