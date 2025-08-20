import { IDL, StableBTreeMap, update, query } from 'azle';
import { AgentPlan, PlanType, PlanLimits, PlanUsage } from '../types';
import { coinService } from '../coin';

export class Plan {
  private agentPlans = new StableBTreeMap<string, AgentPlan>(0);
  private agentResources = new StableBTreeMap<string, string[]>(1);

  private readonly PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    free: {
      maxPolls: 5,
      maxOptions: 5,
      maxTags: 3,
      maxVotesPerMonth: 5,
      maxVoters: 100,
    },
    premium: {
      maxPolls: Infinity,
      maxOptions: 100,
      maxTags: 50,
      maxVotesPerMonth: Infinity,
      maxVoters: Infinity,
    },
  };

  private getAgentPlan(agentId: string): AgentPlan {
    const existingPlan = this.agentPlans.get(agentId);
    const defaultPlan: AgentPlan = {
      plan: 'free',
      upgradedAt: [],
      voteCount: 0,
      lastVoteReset: new Date().toISOString(),
      voterCount: 0,
    };
    return existingPlan ?? defaultPlan;
  }

  private resetMonthlyVotes(agentId: string): void {
    const now = new Date();
    const agentPlan = this.getAgentPlan(agentId);
    const lastReset = new Date(agentPlan.lastVoteReset);

    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
      const updatedPlan: AgentPlan = {
        ...agentPlan,
        voteCount: 0,
        lastVoteReset: now.toISOString(),
      };
      this.agentPlans.insert(agentId, updatedPlan);
    }
  }

  @update(
    [IDL.Text],
    IDL.Record({
      plan: IDL.Text,
      upgradedAt: IDL.Opt(IDL.Text),
      voteCount: IDL.Nat32,
      lastVoteReset: IDL.Text,
      voterCount: IDL.Nat32,
    }),
  )
  upgradeToPremium(agentId: string): AgentPlan {
    const currentPlan = this.getAgentPlan(agentId);

    if (currentPlan.plan === 'premium') {
      throw new Error('You are already on the premium plan');
    }

    const upgradedPlan: AgentPlan = {
      ...currentPlan,
      plan: 'premium',
      upgradedAt: [new Date().toISOString()],
    };

    this.agentPlans.insert(agentId, upgradedPlan);
    return upgradedPlan;
  }

  @update(
    [IDL.Text, IDL.Nat64],
    IDL.Record({
      plan: IDL.Text,
      upgradedAt: IDL.Opt(IDL.Text),
      voteCount: IDL.Nat32,
      lastVoteReset: IDL.Text,
      voterCount: IDL.Nat32,
      paymentId: IDL.Text,
    }),
  )
  upgradeToPremiumWithPayment(agentId: string, transactionId: bigint): AgentPlan & { paymentId: string } {
    const currentPlan = this.getAgentPlan(agentId);

    if (currentPlan.plan === 'premium') {
      throw new Error('You are already on the premium plan');
    }

    // Create payment record
    const paymentRecord = coinService.createPaymentRecord(agentId, transactionId);
    
    // Confirm payment (in a real scenario, this would verify the transaction on the ledger)
    const confirmedPayment = coinService.confirmPayment(paymentRecord.id);
    
    if (confirmedPayment.status !== 'completed') {
      throw new Error('Payment verification failed');
    }

    const upgradedPlan: AgentPlan = {
      ...currentPlan,
      plan: 'premium',
      upgradedAt: [new Date().toISOString()],
    };

    this.agentPlans.insert(agentId, upgradedPlan);
    
    return {
      ...upgradedPlan,
      paymentId: paymentRecord.id
    };
  }

  @query(
    [IDL.Text],
    IDL.Record({
      plan: IDL.Text,
      upgradedAt: IDL.Opt(IDL.Text),
      voteCount: IDL.Nat32,
      lastVoteReset: IDL.Text,
      voterCount: IDL.Nat32,
    }),
  )
  getAgentPlanInfo(agentId: string): AgentPlan {
    return this.getAgentPlan(agentId);
  }

  @query(
    [IDL.Text],
    IDL.Record({
      maxPolls: IDL.Nat32,
      maxOptions: IDL.Nat32,
      maxTags: IDL.Nat32,
      currentPolls: IDL.Nat32,
      maxVotesPerMonth: IDL.Nat32,
      currentVotesThisMonth: IDL.Nat32,
      maxVoters: IDL.Nat32,
      currentVoters: IDL.Nat32,
    }),
  )
  getPlanUsage(agentId: string): PlanUsage {
    const agentPlan = this.getAgentPlan(agentId);
    const limits = this.PLAN_LIMITS[agentPlan.plan];
    const currentPolls = this.agentResources.get(agentId)?.length ?? 0;

    return {
      maxPolls: limits.maxPolls === Infinity ? 0 : limits.maxPolls,
      maxOptions: limits.maxOptions,
      maxTags: limits.maxTags,
      currentPolls: currentPolls,
      maxVotesPerMonth: limits.maxVotesPerMonth === Infinity ? 0 : limits.maxVotesPerMonth,
      currentVotesThisMonth: agentPlan.voteCount,
      maxVoters: limits.maxVoters === Infinity ? 0 : limits.maxVoters,
      currentVoters: agentPlan.voterCount,
    };
  }

  trackVote(agentId: string, voterId: string): void {
    const agentPlan = this.getAgentPlan(agentId);
    const limits = this.PLAN_LIMITS[agentPlan.plan];

    if (agentPlan.plan === 'free' && agentPlan.voteCount >= limits.maxVotesPerMonth) {
      throw new Error(
        `Free plan limited to ${limits.maxVotesPerMonth} votes per month. Upgrade to premium.`,
      );
    }

    if (agentPlan.plan === 'free' && agentPlan.voterCount >= limits.maxVoters) {
      throw new Error(`Free plan limited to ${limits.maxVoters} voters. Upgrade to premium.`);
    }

    const updatedPlan: AgentPlan = {
      ...agentPlan,
      voteCount: agentPlan.voteCount + 1,
      voterCount: agentPlan.voterCount + 1,
    };

    this.agentPlans.insert(agentId, updatedPlan);
  }

  checkCreatePollLimits(agentId: string, options: any[], tags: any[]): void {
    const agentPlan = this.getAgentPlan(agentId);
    const limits = this.PLAN_LIMITS[agentPlan.plan];
    const agentPolls = this.agentResources.get(agentId) ?? [];

    if (agentPolls.length >= limits.maxPolls) {
      throw new Error(
        `Free plan limited to ${limits.maxPolls} polls. Upgrade to premium for unlimited polls.`,
      );
    }

    if (options.length > limits.maxOptions) {
      throw new Error(`Maximum of ${limits.maxOptions} options allowed`);
    }

    if (tags.length > limits.maxTags) {
      throw new Error(`Maximum of ${limits.maxTags} tags allowed`);
    }
  }

  trackPollCreation(agentId: string, pollId: string): void {
    const existingPollIds = this.agentResources.get(agentId) ?? [];
    if (!existingPollIds.includes(pollId)) {
      existingPollIds.push(pollId);
    }
    this.agentResources.insert(agentId, existingPollIds);
  }

  getAgentPolls(agentId: string): string[] {
    return this.agentResources.get(agentId) ?? [];
  }
}

export const plan = new Plan();
