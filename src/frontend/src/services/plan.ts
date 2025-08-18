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