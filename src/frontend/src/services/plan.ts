import { createActor, canisterId } from '../../../declarations/backend';
import { whoAmI } from './auth';

const backend = createActor(canisterId);

export type PlanType = 'free' | 'premium';

export type AgentPlan = {
    plan: PlanType;
    upgradedAt?: string | null; 
    voteCount: number;
    lastVoteReset: string;
    voterCount: number;
};

export type PlanUsage = {
    maxPolls: number;
    maxOptions: number;
    maxTags: number;
    currentPolls: number;
    maxVotesPerMonth: number;
    currentVotesThisMonth: number;
    maxVoters: number;
    currentVoters: number;
};

export const getMyPlanInfo = async (): Promise<AgentPlan> => {
  const agentId = (await whoAmI()).toString();
  if (!agentId) throw new Error('Authentication required');

  const response = await backend.getAgentPlanInfo(agentId);
  
  return {
    plan: response.plan as PlanType,
    upgradedAt: response.upgradedAt.length ? response.upgradedAt[0] : null,
    voteCount: Number(response.voteCount),
    lastVoteReset: response.lastVoteReset,
    voterCount: Number(response.voterCount),
  };
};

export const getMyPlanUsage = async (): Promise<PlanUsage> => {
  const agentId = (await whoAmI()).toString();
  if (!agentId) throw new Error('Authentication required');

  const response = await backend.getPlanUsage(agentId);
  
  return {
    maxPolls: Number(response.maxPolls),
    maxOptions: Number(response.maxOptions),
    maxTags: Number(response.maxTags),
    currentPolls: Number(response.currentPolls),
    maxVotesPerMonth: Number(response.maxVotesPerMonth),
    currentVotesThisMonth: Number(response.currentVotesThisMonth),
    maxVoters: Number(response.maxVoters),
    currentVoters: Number(response.currentVoters),
  };
};

export const upgradeToPremium = async (): Promise<AgentPlan> => {
  const agentId = (await whoAmI()).toString();
  if (!agentId) throw new Error('Authentication required');

  const response = await backend.upgradeToPremium(agentId);
  
  return {
    plan: response.plan as PlanType,
    upgradedAt: response.upgradedAt.length ? response.upgradedAt[0] : null,
    voteCount: Number(response.voteCount),
    lastVoteReset: response.lastVoteReset,
    voterCount: Number(response.voterCount),
  };
};

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

export interface UpgradeWithPaymentResult extends AgentPlan {
  paymentId: string;
}

export const getPremiumPlanPrice = async (): Promise<number> => {
  const response = await backend.getPremiumPlanPrice();
  return Number(response) / 100000000; // Convert from e8s to ICP
};

export const upgradeToPremiumWithPayment = async (transactionId: bigint): Promise<UpgradeWithPaymentResult> => {
  const agentId = (await whoAmI()).toString();
  if (!agentId) throw new Error('Authentication required');

  const response = await backend.upgradeToPremiumWithPayment(agentId, transactionId);
  
  return {
    plan: response.plan as PlanType,
    upgradedAt: response.upgradedAt.length ? response.upgradedAt[0] : null,
    voteCount: Number(response.voteCount),
    lastVoteReset: response.lastVoteReset,
    voterCount: Number(response.voterCount),
    paymentId: response.paymentId,
  };
};

export const getPaymentHistory = async (): Promise<PaymentRecord[]> => {
  const agentId = (await whoAmI()).toString();
  if (!agentId) throw new Error('Authentication required');

  const response = await backend.getPaymentHistory(agentId);
  
  return response.map(payment => ({
    id: payment.id,
    agentId: payment.agentId,
    amount: payment.amount,
    transactionId: payment.transactionId,
    planType: payment.planType,
    status: payment.status as 'pending' | 'completed' | 'failed',
    createdAt: payment.createdAt,
    completedAt: payment.completedAt.length ? payment.completedAt[0] : undefined,
  }));
};

export const hasSufficientBalance = async (balance: bigint): Promise<boolean> => {
  return await backend.hasSufficientBalance(balance);
};