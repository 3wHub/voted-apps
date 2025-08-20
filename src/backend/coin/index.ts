import { IDL, StableBTreeMap, update, query, ic } from 'azle';
import { Principal } from '@dfinity/principal';

export interface PaymentRecord {
  id: string;
  agentId: string;
  amount: bigint;
  transactionId: bigint;
  planType: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export interface WalletBalance {
  agentId: string;
  balance: bigint;
  lastUpdated: string;
}

export class CoinService {
  private payments = new StableBTreeMap<string, PaymentRecord>(2);
  private walletBalances = new StableBTreeMap<string, WalletBalance>(3);
  
  // Premium plan price in ICP (e8s format - 1 ICP = 100,000,000 e8s)
  private readonly PREMIUM_PLAN_PRICE = BigInt(100000000); // 1 ICP

  @query([IDL.Text], IDL.Nat64)
  getPremiumPlanPrice(): bigint {
    return this.PREMIUM_PLAN_PRICE;
  }

  @update([IDL.Text, IDL.Nat64], IDL.Record({
    id: IDL.Text,
    agentId: IDL.Text,
    amount: IDL.Nat64,
    transactionId: IDL.Nat64,
    planType: IDL.Text,
    status: IDL.Text,
    createdAt: IDL.Text,
    completedAt: IDL.Opt(IDL.Text)
  }))
  createPaymentRecord(agentId: string, transactionId: bigint): any {
    const paymentId = `payment_${Date.now()}_${agentId}`;
    
    const payment: PaymentRecord = {
      id: paymentId,
      agentId,
      amount: this.PREMIUM_PLAN_PRICE,
      transactionId,
      planType: 'premium',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.payments.insert(paymentId, payment);
    
    // Return with proper Candid format
    return {
      ...payment,
      completedAt: []
    };
  }

  @update([IDL.Text], IDL.Record({
    id: IDL.Text,
    agentId: IDL.Text,
    amount: IDL.Nat64,
    transactionId: IDL.Nat64,
    planType: IDL.Text,
    status: IDL.Text,
    createdAt: IDL.Text,
    completedAt: IDL.Opt(IDL.Text)
  }))
  confirmPayment(paymentId: string): any {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Payment record not found');
    }

    if (payment.status !== 'pending') {
      throw new Error('Payment already processed');
    }

    const completedAt = new Date().toISOString();
    const updatedPayment: PaymentRecord = {
      ...payment,
      status: 'completed',
      completedAt
    };

    this.payments.insert(paymentId, updatedPayment);
    
    // Return with proper Candid format
    return {
      ...updatedPayment,
      completedAt: [completedAt]
    };
  }

  @query([IDL.Text], IDL.Vec(IDL.Record({
    id: IDL.Text,
    agentId: IDL.Text,
    amount: IDL.Nat64,
    transactionId: IDL.Nat64,
    planType: IDL.Text,
    status: IDL.Text,
    createdAt: IDL.Text,
    completedAt: IDL.Opt(IDL.Text)
  })))
  getPaymentHistory(agentId: string): PaymentRecord[] {
    const allPayments: PaymentRecord[] = [];
    
    for (const [_, payment] of this.payments.items()) {
      if (payment.agentId === agentId) {
        // Ensure completedAt is properly formatted for Candid
        const formattedPayment = {
          ...payment,
          completedAt: payment.completedAt ? [payment.completedAt] : []
        };
        allPayments.push(formattedPayment as PaymentRecord);
      }
    }

    return allPayments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  @query([IDL.Text], IDL.Opt(IDL.Record({
    id: IDL.Text,
    agentId: IDL.Text,
    amount: IDL.Nat64,
    transactionId: IDL.Nat64,
    planType: IDL.Text,
    status: IDL.Text,
    createdAt: IDL.Text,
    completedAt: IDL.Opt(IDL.Text)
  })))
  getPaymentRecord(paymentId: string): [] | [PaymentRecord] {
    const payment = this.payments.get(paymentId);
    return payment ? [payment] : [];
  }

  @update([IDL.Text, IDL.Nat64], IDL.Record({
    agentId: IDL.Text,
    balance: IDL.Nat64,
    lastUpdated: IDL.Text
  }))
  updateWalletBalance(agentId: string, balance: bigint): WalletBalance {
    const walletBalance: WalletBalance = {
      agentId,
      balance,
      lastUpdated: new Date().toISOString()
    };

    this.walletBalances.insert(agentId, walletBalance);
    return walletBalance;
  }

  @query([IDL.Text], IDL.Opt(IDL.Record({
    agentId: IDL.Text,
    balance: IDL.Nat64,
    lastUpdated: IDL.Text
  })))
  getWalletBalance(agentId: string): [] | [WalletBalance] {
    const balance = this.walletBalances.get(agentId);
    return balance ? [balance] : [];
  }

  @query([IDL.Text, IDL.Nat64], IDL.Bool)
  validatePaymentAmount(agentId: string, amount: bigint): boolean {
    return amount >= this.PREMIUM_PLAN_PRICE;
  }

  @query([IDL.Nat64], IDL.Bool)
  hasSufficientBalance(balance: bigint): boolean {
    return balance >= this.PREMIUM_PLAN_PRICE;
  }

  // Helper method to check if payment is completed
  isPaymentCompleted(paymentId: string): boolean {
    const payment = this.payments.get(paymentId);
    return payment?.status === 'completed' || false;
  }

  // Helper method to get completed payments for an agent
  getCompletedPayments(agentId: string): PaymentRecord[] {
    return this.getPaymentHistory(agentId).filter(p => p.status === 'completed');
  }
}

export const coinService = new CoinService();