import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE as BackendService } from '../../../declarations/backend/backend.did';

export interface PlanLimits {
  maxPolls: number;
  maxOptions: number;
  maxTags: number;
  maxVotesPerMonth: number;
  maxVoters: number;
}

export interface PlanUsage {
  maxPolls: number;
  maxOptions: number;
  maxTags: number;
  currentPolls: number;
  maxVotesPerMonth: number;
  currentVotesThisMonth: number;
  maxVoters: number;
  currentVoters: number;
}

export interface AgentPlan {
  plan: 'free' | 'premium';
  upgradedAt: string[];
  voteCount: number;
  lastVoteReset: string;
  voterCount: number;
}

export type PlanType = 'free' | 'premium';

export class PlanMiddleware {
  private backendActor: ActorSubclass<BackendService>;

  constructor(backendActor: ActorSubclass<BackendService>) {
    this.backendActor = backendActor;
  }

  private isPlanType(plan: string): plan is PlanType {
    return plan === 'free' || plan === 'premium';
  }

  private normalizePlanResponse(response: {
    plan: string;
    upgradedAt: [string] | [];
    lastVoteReset: string;
    voteCount: number;
    voterCount: number;
  }): AgentPlan {
    return {
      ...response,
      plan: this.isPlanType(response.plan) ? response.plan : 'free',
      upgradedAt: Array.isArray(response.upgradedAt) ? response.upgradedAt : [],
    };
  }

  private normalizeAgentPlan(response: {
    plan: string;
    upgradedAt: string[] | [];
    lastVoteReset: string;
    voteCount: number;
    voterCount: number;
  }): AgentPlan {
    return {
      ...response,
      plan: this.isPlanType(response.plan) ? response.plan : 'free',
      upgradedAt: Array.isArray(response.upgradedAt) ? response.upgradedAt : [],
    };
  }

  async getAgentPlanInfo(agentId: string): Promise<AgentPlan> {
    try {
      const response = await this.backendActor.getAgentPlanInfo(agentId);
      return this.normalizePlanResponse(response);
    } catch (error) {
      console.error('Error fetching agent plan info:', error);
      return {
        plan: 'free',
        upgradedAt: [],
        voteCount: 0,
        lastVoteReset: new Date().toISOString(),
        voterCount: 0,
      };
    }
  }

  async getPlanUsage(agentId: string): Promise<PlanUsage> {
    try {
      return await this.backendActor.getPlanUsage(agentId);
    } catch (error) {
      console.error('Error fetching plan usage:', error);
      return {
        maxPolls: 5,
        maxOptions: 5,
        maxTags: 3,
        currentPolls: 0,
        maxVotesPerMonth: 5,
        currentVotesThisMonth: 0,
        maxVoters: 100,
        currentVoters: 0,
      };
    }
  }

  async upgradeToPremium(agentId: string): Promise<AgentPlan> {
    try {
      const response = await this.backendActor.upgradeToPremium(agentId);
      return this.normalizeAgentPlan(response);
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      throw error;
    }
  }

  async checkCreatePollLimits(
    agentId: string,
    optionsCount: number,
    tagsCount: number,
  ): Promise<void> {
    const usage = await this.getPlanUsage(agentId);

    if (usage.currentPolls >= usage.maxPolls && usage.maxPolls !== 0) {
      throw new Error(
        `You've reached your poll limit (${usage.maxPolls}). Upgrade to premium for unlimited polls.`,
      );
    }

    if (optionsCount > usage.maxOptions) {
      throw new Error(`Maximum of ${usage.maxOptions} options allowed.`);
    }

    if (tagsCount > usage.maxTags) {
      throw new Error(`Maximum of ${usage.maxTags} tags allowed.`);
    }
  }

  async checkVoteLimits(agentId: string): Promise<void> {
    const usage = await this.getPlanUsage(agentId);
    const planInfo = await this.getAgentPlanInfo(agentId);

    if (usage.currentVotesThisMonth >= usage.maxVotesPerMonth && usage.maxVotesPerMonth !== 0) {
      throw new Error(
        `You've reached your monthly vote limit (${usage.maxVotesPerMonth}). Upgrade to premium for unlimited votes.`,
      );
    }

    if (planInfo.voterCount >= usage.maxVoters && usage.maxVoters !== 0) {
      throw new Error(
        `You've reached your voter limit (${usage.maxVoters}). Upgrade to premium for unlimited voters.`,
      );
    }
  }

  async isPremiumUser(agentId: string): Promise<boolean> {
    const planInfo = await this.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }
}
