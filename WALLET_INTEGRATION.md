# ICP Wallet Integration with Plan Upgrade System

This document describes the integration of ICP wallet functionality with the plan upgrade system in the VoteD application.

## Overview

The integration allows users to upgrade from Free to Premium plans using their ICP wallet balance. The system includes:

1. **Backend Integration**: Coin service for payment processing and validation
2. **Frontend Components**: Wallet management and upgrade interface
3. **Payment Tracking**: Complete payment history and transaction records

## Backend Components

### 1. Coin Service (`src/backend/coin/index.ts`)

The coin service handles:
- Payment record creation and management
- Wallet balance tracking
- Premium plan pricing (1 ICP)
- Payment validation and confirmation

Key methods:
- `getPremiumPlanPrice()`: Returns the price for premium plan (1 ICP)
- `createPaymentRecord()`: Creates a new payment record
- `confirmPayment()`: Confirms payment completion
- `getPaymentHistory()`: Retrieves payment history for a user
- `updateWalletBalance()`: Updates user's wallet balance
- `hasSufficientBalance()`: Validates if user has enough ICP

### 2. Enhanced Plan Service (`src/backend/plan/index.ts`)

Extended with:
- `upgradeToPremiumWithPayment()`: Upgrade with ICP payment validation
- Integration with coin service for payment processing

### 3. Main Backend (`src/backend/index.ts`)

Added endpoints:
- `getPremiumPlanPrice`
- `upgradeToPremiumWithPayment`
- `getPaymentHistory`
- `getWalletBalance`
- `updateWalletBalance`
- `hasSufficientBalance`

## Frontend Components

### 1. Enhanced Plan Service (`src/frontend/src/services/plan.ts`)

Added functions:
- `getPremiumPlanPrice()`: Get premium plan price
- `upgradeToPremiumWithPayment()`: Upgrade with payment
- `getPaymentHistory()`: Get user's payment history
- `hasSufficientBalance()`: Check if user has sufficient balance

### 2. Enhanced Wallet Service (`src/frontend/src/services/wallet.ts`)

Extended with:
- `getWalletBalance()`: Get wallet balance from backend
- `updateWalletBalance()`: Update wallet balance
- `syncWalletBalance()`: Sync with ICP ledger
- `formatIcpAmount()`: Format ICP amounts for display
- `parseIcpAmount()`: Parse ICP amounts from strings

### 3. Wallet Upgrade Component (`src/frontend/src/lib/pages/plan/WalletUpgrade.tsx`)

A comprehensive upgrade component that:
- Shows current wallet balance
- Validates sufficient funds
- Processes payment with ICP
- Handles upgrade confirmation
- Provides real-time feedback

### 4. Enhanced Plan Page (`src/frontend/src/lib/pages/plan/index.tsx`)

Updated to include:
- Wallet upgrade modal
- Payment success/error handling
- Integration with wallet upgrade component

### 5. Enhanced Wallet Page (`src/frontend/src/lib/pages/wallet/index.tsx`)

Complete wallet management interface:
- ICP balance display with refresh functionality
- Send ICP functionality
- Payment history for plan upgrades
- Recent transfer history
- Responsive design with proper error handling

## Features

### 1. Payment Processing
- **Price**: 1 ICP for Premium plan upgrade
- **Validation**: Checks sufficient balance before processing
- **Transaction Tracking**: Complete audit trail of all payments
- **Status Management**: Pending, completed, and failed payment states

### 2. Wallet Management
- **Balance Sync**: Real-time balance synchronization with ICP ledger
- **Transfer Functionality**: Send ICP to other principals
- **History Tracking**: Complete transaction and payment history
- **Error Handling**: Comprehensive error handling and user feedback

### 3. User Experience
- **Modal Interface**: Clean modal for upgrade process
- **Real-time Feedback**: Loading states and progress indicators
- **Balance Validation**: Prevents insufficient balance transactions
- **Success Confirmation**: Clear confirmation of successful upgrades

## Security Features

1. **Payment Validation**: All payments are validated before processing
2. **Transaction IDs**: Unique transaction IDs for audit trails
3. **Balance Verification**: Real-time balance verification
4. **Error Handling**: Comprehensive error handling prevents invalid states

## Usage Flow

1. **User Login**: User authenticates with Internet Identity
2. **Plan Selection**: User selects Premium plan upgrade
3. **Wallet Check**: System checks ICP wallet balance
4. **Payment Processing**: If sufficient balance, payment is processed
5. **Plan Upgrade**: Upon successful payment, plan is upgraded
6. **Confirmation**: User receives confirmation with payment ID

## Configuration

### Premium Plan Price
The premium plan price is set to 1 ICP (100,000,000 e8s) and can be configured in:
```typescript
// Backend: src/backend/coin/index.ts
private readonly PREMIUM_PLAN_PRICE = BigInt(100000000); // 1 ICP
```

### ICP Ledger Integration
The system integrates with the ICP ledger canister configured in `dfx.json`:
```json
"icp_ledger_canister": {
  "type": "custom",
  "candid": "https://github.com/dfinity/ic/releases/download/ledger-suite-icp-2025-07-04/ledger.did",
  "wasm": "https://github.com/dfinity/ic/releases/download/ledger-suite-icp-2025-07-04/ledger-canister_notify-method.wasm.gz"
}
```

## Development Notes

1. **Testing**: The system includes mock transaction IDs for development
2. **Error Handling**: Comprehensive error handling throughout the stack
3. **Type Safety**: Full TypeScript integration with proper type definitions
4. **Responsive Design**: Mobile-friendly interface components

## Future Enhancements

1. **Multiple Payment Methods**: Support for other cryptocurrencies
2. **Subscription Management**: Recurring payment handling
3. **Refund System**: Automated refund processing
4. **Advanced Analytics**: Payment analytics and reporting
5. **Multi-tier Pricing**: Support for multiple premium tiers

This integration provides a complete, production-ready solution for ICP-based plan upgrades with comprehensive wallet management capabilities.