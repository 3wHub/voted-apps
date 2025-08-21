import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE as BackendService } from '../../../declarations/backend/backend.did';
import { PlanMiddleware, AgentPlan, PlanUsage } from './plan';
import { whoAmI } from '@/services/auth';

export interface PollVisibilitySettings {
  showPercentage: boolean;
  isPrivate: boolean;
  privateLink?: string;
}

export interface PollSensitivitySettings {
  isSensitive: boolean;
  contentWarning?: string;
}

export interface TemplateVoting {
  id: string;
  name: string;
  description: string;
  options: string[];
  tags: string[];
}

export interface ICPIntegration {
  enabled: boolean;
  tokenAmount?: number;
  walletAddress?: string;
}

export interface PremiumFeatureError extends Error {
  featureName: string;
  requiredPlan: 'premium';
  currentPlan: 'free' | 'premium';
}

export class FeatureMiddleware {
  private backendActor: ActorSubclass<BackendService>;
  private planMiddleware: PlanMiddleware;

  constructor(backendActor: ActorSubclass<BackendService>) {
    this.backendActor = backendActor;
    this.planMiddleware = new PlanMiddleware(backendActor);
  }

  private createPremiumError(featureName: string, currentPlan: 'free' | 'premium'): PremiumFeatureError {
    const error = new Error(`${featureName} is only available for Premium users. Please upgrade your plan.`) as PremiumFeatureError;
    error.featureName = featureName;
    error.requiredPlan = 'premium';
    error.currentPlan = currentPlan;
    return error;
  }

  async canHideShowPercentage(): Promise<boolean> {
    const agentId = await whoAmI().then(id => id.toString());
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async validatePercentageVisibility(showPercentage: boolean): Promise<void> {
    const agentId = await whoAmI().then(id => id.toString());
    if (!showPercentage) {
      const isPremium = await this.canHideShowPercentage();
      if (!isPremium) {
        const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
        throw this.createPremiumError('Hide vote percentage', planInfo.plan);
      }
    }
  }

  async canCreatePrivateVote(): Promise<boolean> {
    const agentId = await whoAmI().then(id => id.toString());
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async validatePrivateVote(isPrivate: boolean): Promise<void> {
    const agentId = await whoAmI().then(id => id.toString());
    if (isPrivate) {
      const isPremium = await this.canCreatePrivateVote();
      if (!isPremium) {
        const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
        throw this.createPremiumError('Private voting', planInfo.plan);
      }
    }
  }

  async generatePrivateLink(pollId: string): Promise<string> {
    const agentId = await whoAmI().then(id => id.toString());
    const isPremium = await this.canCreatePrivateVote();
    if (!isPremium) {
      const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
      throw this.createPremiumError('Private link generation', planInfo.plan);
    }
    const privateToken = btoa(`${pollId}-${agentId}-${Date.now()}`);
    return `${window.location.origin}/private-vote/${privateToken}`;
  }

  async canCreateSensitiveContent(): Promise<boolean> {
    const agentId = await whoAmI().then(id => id.toString());
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async validateSensitiveContent(isSensitive: boolean): Promise<void> {
    const agentId = await whoAmI().then(id => id.toString());
    if (isSensitive) {
      const isPremium = await this.canCreateSensitiveContent();
      if (!isPremium) {
        const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
        throw this.createPremiumError('Sensitive content polls', planInfo.plan);
      }
    }
  }

  async canUseTemplates(): Promise<boolean> {
    const agentId = await whoAmI().then(id => id.toString());
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async validateTemplateUsage(): Promise<void> {
    const agentId = await whoAmI().then(id => id.toString());
    const isPremium = await this.canUseTemplates();
    if (!isPremium) {
      const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
      throw this.createPremiumError('Voting templates', planInfo.plan);
    }
  }

  async canUseICPIntegration(): Promise<boolean> {
    const agentId = await whoAmI().then(id => id.toString());
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async validateICPIntegration(integration: ICPIntegration): Promise<void> {
    const agentId = await whoAmI().then(id => id.toString());
    if (integration.enabled) {
      const isPremium = await this.canUseICPIntegration();
      if (!isPremium) {
        const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
        throw this.createPremiumError('ICP coin integration', planInfo.plan);
      }
    }
  }

  async hasPremiumBadge(): Promise<boolean> {
    const agentId = await whoAmI().then(id => id.toString());
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async getPremiumBadgeInfo(): Promise<{ hasBadge: boolean; badgeText?: string; badgeColor?: string }> {
    const hasBadge = await this.hasPremiumBadge();
    if (hasBadge) {
      return {
        hasBadge: true,
        badgeText: 'Premium',
        badgeColor: 'gold'
      };
    }
    return { hasBadge: false };
  }

  async validateFreePlanLimits(): Promise<void> {
    const agentId = await whoAmI().then(id => id.toString());
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    if (planInfo.plan === 'free') {
      const usage = await this.planMiddleware.getPlanUsage(agentId);
      if (usage.currentVotesThisMonth >= 5) {
        throw new Error('You have reached your monthly voting limit (5 votes). Upgrade to Premium for unlimited votes.');
      }
      if (usage.currentVoters >= 100) {
        throw new Error('You have reached your voter limit (100 voters). Upgrade to Premium for unlimited voters.');
      }
    }
  }

  async validatePollCreation(pollSettings: {
    showPercentage?: boolean;
    isPrivate?: boolean;
    isSensitive?: boolean;
    useTemplate?: boolean;
    icpIntegration?: ICPIntegration;
    optionsCount: number;
    tagsCount: number;
  }): Promise<void> {
    const agentId = await whoAmI().then(id => id.toString());
    await this.planMiddleware.checkCreatePollLimits(agentId, pollSettings.optionsCount, pollSettings.tagsCount);
    await this.validateFreePlanLimits();
    if (pollSettings.showPercentage === false) {
      await this.validatePercentageVisibility(pollSettings.showPercentage);
    }
    if (pollSettings.isPrivate) {
      await this.validatePrivateVote(pollSettings.isPrivate);
    }
    if (pollSettings.isSensitive) {
      await this.validateSensitiveContent(pollSettings.isSensitive);
    }
    if (pollSettings.useTemplate) {
      await this.validateTemplateUsage();
    }
    if (pollSettings.icpIntegration) {
      await this.validateICPIntegration(pollSettings.icpIntegration);
    }
  }

  async getAvailableFeatures(): Promise<{
    canHidePercentage: boolean;
    canCreatePrivateVotes: boolean;
    canCreateSensitiveContent: boolean;
    canUseTemplates: boolean;
    canUseICPIntegration: boolean;
    hasPremiumBadge: boolean;
    planInfo: AgentPlan;
    usage: PlanUsage;
  }> {
    const agentId = await whoAmI().then(id => id.toString());
    const [
      canHidePercentage,
      canCreatePrivateVotes,
      canCreateSensitiveContent,
      canUseTemplates,
      canUseICPIntegration,
      hasPremiumBadge,
      planInfo,
      usage
    ] = await Promise.all([
      this.canHideShowPercentage(),
      this.canCreatePrivateVote(),
      this.canCreateSensitiveContent(),
      this.canUseTemplates(),
      this.canUseICPIntegration(),
      this.hasPremiumBadge(),
      this.planMiddleware.getAgentPlanInfo(agentId),
      this.planMiddleware.getPlanUsage(agentId)
    ]);
    return {
      canHidePercentage,
      canCreatePrivateVotes,
      canCreateSensitiveContent,
      canUseTemplates,
      canUseICPIntegration,
      hasPremiumBadge,
      planInfo,
      usage
    };
  }
}