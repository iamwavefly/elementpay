# ElementPay Frontend Assessment

A Next.js application demonstrating wallet integration, order processing, and webhook handling.

## Features

- **Multi-wallet Support**: Connect MetaMask and WalletConnect wallets
- **Order Management**: Create orders with comprehensive form validation
- **Real-time Status**: Poll order status and listen for webhook notifications
- **Race Condition Handling**: First finalizer wins, duplicates are ignored
- **Professional UI**: Clean, minimalist design with loading states
- **Production Ready**: Comprehensive error handling, security features, and optimization

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- wagmi/viem for wallet integration
- RainbowKit for wallet UI
- React Query for data fetching

## Setup Instructions

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd element-pay
   npm install
   ```

2. **No environment setup required:**
   The application works out of the box without any configuration. All settings are hardcoded for simplicity.

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Mock Order API

- `POST /api/mock/orders/create` - Create a new order
- `GET /api/mock/orders/:order_id` - Get order status (time-based)

### Webhook API

- `POST /api/webhooks/elementpay` - Webhook endpoint for order updates

## Webhook Testing

Use the following curl commands to test webhook functionality:

### Valid Webhook (should return 200)

```bash
curl -X POST http://localhost:3000/api/webhooks/elementpay \
  -H 'Content-Type: application/json' \
  -H 'X-Webhook-Signature: t=1710000000,v1=9ylbFTfko9hM6OoVTP8WpZz28Zt+TzSHHkFrylDokRo=' \
  -d '{"type":"order.settled","data":{"order_id":"ord_0xabc123","status":"settled"}}'
```

### Invalid Signature (should return 401)

```bash
curl -X POST http://localhost:3000/api/webhooks/elementpay \
  -H 'Content-Type: application/json' \
  -H 'X-Webhook-Signature: t=1710000300,v1=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' \
  -d '{"type":"order.failed","data":{"order_id":"ord_0xabc123","status":"failed"}}'
```

### Expired Timestamp (should return 401)

```bash
curl -X POST http://localhost:3000/api/webhooks/elementpay \
  -H 'Content-Type: application/json' \
  -H 'X-Webhook-Signature: t=1709990000,v1=ITp8xyUSyUmhxgMhMjiJXeVKCTtIVEHpydWhXG6RKoI=' \
  -d '{"type":"order.processing","data":{"order_id":"ord_0xabc123","status":"processing"}}'
```

## Architecture Notes

### Order Status Flow

1. **Created** (0-7s): Order is created and waiting
2. **Processing** (8-17s): Order is being processed
3. **Settled/Failed** (18s+): Final state (80% settled, 20% failed)

### Race Condition Handling

- Both polling and webhook can update order status
- First finalizer (settled/failed) wins
- Duplicate updates after finalization are ignored
- Polling stops after 60 seconds or final state

### Webhook Security

- HMAC-SHA256 signature verification
- Timestamp freshness check (5-minute window)
- Constant-time comparison to prevent timing attacks
- Raw body verification before JSON parsing

### State Management

- React state for UI state management
- In-memory storage for mock API data
- Polling with 3-second intervals
- Automatic cleanup on component unmount

## Assumptions

1. **Wallet Connection**: Users must connect a wallet before creating orders
2. **Order Validation**: Amount must be > 0, currency and token are required
3. **Timeout Handling**: Orders timeout after 60 seconds if no final state
4. **Error Handling**: Graceful error handling with user-friendly messages
5. **Responsive Design**: Works on desktop and mobile devices

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── mock/orders/          # Mock Order API
│   │   │   ├── create/route.ts   # Create order endpoint
│   │   │   └── [order_id]/route.ts # Get order status
│   │   └── webhooks/elementpay/  # Webhook endpoint
│   │       └── route.ts
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React Components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── StatusIcon.tsx
│   │   └── index.ts
│   ├── state/                    # Application state components
│   │   ├── WalletState.tsx
│   │   ├── ProcessingState.tsx
│   │   ├── CompletedState.tsx
│   │   ├── TimeoutState.tsx
│   │   └── index.ts
│   ├── receipt/                  # Receipt components
│   │   ├── PaymentReceipt.tsx
│   │   └── index.ts
│   ├── AppStateManager.tsx       # Main app orchestrator
│   ├── AppRenderer.tsx          # Pure render logic
│   ├── WalletConnect.tsx
│   ├── OrderForm.tsx
│   ├── OrderStatus.tsx
│   └── Providers.tsx
├── hooks/                        # Custom React hooks
│   ├── useOrderApi.ts           # API calls logic
│   ├── useAppState.ts           # App state management
│   └── index.ts
├── lib/                          # Utilities and configuration
│   ├── env.ts                   # Environment variables
│   ├── wallet.ts                # Wallet configuration
│   ├── storage.ts               # In-memory storage
│   └── webhook.ts               # Webhook utilities
└── types/
    └── index.ts                 # TypeScript type definitions
```

### Architecture Highlights

- **Modular Design**: Components are split into logical directories (ui, state, receipt)
- **Custom Hooks**: Business logic separated into reusable hooks
- **Type Safety**: Comprehensive TypeScript definitions
- **Code Splitting**: Each component in its own file for maintainability
- **Clean Separation**: UI, business logic, and API calls are separated

## License

MIT
