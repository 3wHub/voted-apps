import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE as BackendService } from '../../../declarations/backend/backend.did';
import { PlanMiddleware, AgentPlan, PlanUsage } from './plan';

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

export class PremiumFeaturesMiddleware {
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

  async canHideShowPercentage(agentId: string): Promise<boolean> {
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async validatePercentageVisibility(agentId: string, showPercentage: boolean): Promise<void> {
    if (!showPercentage) {
      const isPremium = await this.canHideShowPercentage(agentId);
      if (!isPremium) {
        const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
        throw this.createPremiumError('Hide vote percentage', planInfo.plan);
      }
    }
  }

  async canCreatePrivateVote(agentId: string): Promise<boolean> {
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async validatePrivateVote(agentId: string, isPrivate: boolean): Promise<void> {
    if (isPrivate) {
      const isPremium = await this.canCreatePrivateVote(agentId);
      if (!isPremium) {
        const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
        throw this.createPremiumError('Private voting', planInfo.plan);
      }
    }
  }

  async generatePrivateLink(agentId: string, pollId: string): Promise<string> {
    const isPremium = await this.canCreatePrivateVote(agentId);
    if (!isPremium) {
      const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
      throw this.createPremiumError('Private link generation', planInfo.plan);
    }
    
    const privateToken = btoa(`${pollId}-${agentId}-${Date.now()}`);
    return `${window.location.origin}/private-vote/${privateToken}`;
  }

  async canCreateSensitiveContent(agentId: string): Promise<boolean> {
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async validateSensitiveContent(agentId: string, isSensitive: boolean): Promise<void> {
    if (isSensitive) {
      const isPremium = await this.canCreateSensitiveContent(agentId);
      if (!isPremium) {
        const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
        throw this.createPremiumError('Sensitive content polls', planInfo.plan);
      }
    }
  }

  async canUseTemplates(agentId: string): Promise<boolean> {
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async validateTemplateUsage(agentId: string): Promise<void> {
    const isPremium = await this.canUseTemplates(agentId);
    if (!isPremium) {
      const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
      throw this.createPremiumError('Voting templates', planInfo.plan);
    }
  }


  async canUseICPIntegration(agentId: string): Promise<boolean> {
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async validateICPIntegration(agentId: string, integration: ICPIntegration): Promise<void> {
    if (integration.enabled) {
      const isPremium = await this.canUseICPIntegration(agentId);
      if (!isPremium) {
        const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
        throw this.createPremiumError('ICP coin integration', planInfo.plan);
      }
    }
  }

  async hasPremiumBadge(agentId: string): Promise<boolean> {
    const planInfo = await this.planMiddleware.getAgentPlanInfo(agentId);
    return planInfo.plan === 'premium';
  }

  async getPremiumBadgeInfo(agentId: string): Promise<{ hasBadge: boolean; badgeText?: string; badgeColor?: string }> {
    const hasBadge = await this.hasPremiumBadge(agentId);
    
    if (hasBadge) {
      return {
        hasBadge: true,
        badgeText: 'Premium',
        badgeColor: 'gold'
      };
    }
    
    return { hasBadge: false };
  }

  async validateFreePlanLimits(agentId: string): Promise<void> {
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

  async validatePollCreation(agentId: string, pollSettings: {
    showPercentage?: boolean;
    isPrivate?: boolean;
    isSensitive?: boolean;
    useTemplate?: boolean;
    icpIntegration?: ICPIntegration;
    optionsCount: number;
    tagsCount: number;
  }): Promise<void> {
    await this.planMiddleware.checkCreatePollLimits(agentId, pollSettings.optionsCount, pollSettings.tagsCount);
    
    await this.validateFreePlanLimits(agentId);
    
    if (pollSettings.showPercentage === false) {
      await this.validatePercentageVisibility(agentId, false);
    }
    
    if (pollSettings.isPrivate) {
      await this.validatePrivateVote(agentId, true);
    }
    
    if (pollSettings.isSensitive) {
      await this.validateSensitiveContent(agentId, true);
    }
    
    if (pollSettings.useTemplate) {
      await this.validateTemplateUsage(agentId);
    }
    
    if (pollSettings.icpIntegration) {
      await this.validateICPIntegration(agentId, pollSettings.icpIntegration);
    }
  }

  async getAvailableFeatures(agentId: string): Promise<{
    canHidePercentage: boolean;
    canCreatePrivateVotes: boolean;
    canCreateSensitiveContent: boolean;
    canUseTemplates: boolean;
    canUseICPIntegration: boolean;
    hasPremiumBadge: boolean;
    planInfo: AgentPlan;
    usage: PlanUsage;
  }> {
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
      this.canHideShowPercentage(agentId),
      this.canCreatePrivateVote(agentId),
      this.canCreateSensitiveContent(agentId),
      this.canUseTemplates(agentId),
      this.canUseICPIntegration(agentId),
      this.hasPremiumBadge(agentId),
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
