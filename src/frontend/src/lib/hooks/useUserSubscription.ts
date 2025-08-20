import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/helpers/useAuth';
import { getMyPlanInfo, getMyPlanUsage, AgentPlan, PlanUsage } from '@/services/plan';

export type SubscriptionType = 'free' | 'premium';

interface UserSubscription {
  type: SubscriptionType;
  isActive: boolean;
  expirationDate?: Date;
  features: string[];
  planInfo?: AgentPlan;
  planUsage?: PlanUsage;
}

interface UseUserSubscriptionReturn {
  subscription: UserSubscription;
  isLoading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
}

// Default free subscription
const defaultSubscription: UserSubscription = {
  type: 'free',
  isActive: true,
  features: [
    'Basic voting',
    'View public polls',
    'Create up to 5 polls per month',
    'Maximum 100 voters per poll',
    'Maximum 5 options per poll',
    'Standard support'
  ]
};

export const useUserSubscription = (): UseUserSubscriptionReturn => {
  const { principal, isLoggedIn } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription>(defaultSubscription);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!principal || !isLoggedIn) {
      setSubscription(defaultSubscription);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [planInfo, planUsage] = await Promise.all([
        getMyPlanInfo(),
        getMyPlanUsage()
      ]);

      const features = planInfo.plan === 'premium' ? [
        'Unlimited voting',
        'Create unlimited polls',
        'Unlimited voters per poll',
        'Unlimited options per poll',
        'Advanced analytics',
        'Priority support',
        'Premium badge',
        'Integration with ICP coin',
        'Export data',
        'Private polls'
      ] : [
        'Basic voting',
        'View public polls',
        `Create up to ${planUsage.maxPolls} polls per month`,
        `Maximum ${planUsage.maxVoters} voters per poll`,
        `Maximum ${planUsage.maxOptions} options per poll`,
        `Maximum ${planUsage.maxTags} tags per poll`,
        'Standard support'
      ];

      setSubscription({
        type: planInfo.plan,
        isActive: true,
        expirationDate: planInfo.upgradedAt ? undefined : undefined, // Premium doesn't expire in this implementation
        features,
        planInfo,
        planUsage
      });
    } catch (err) {
      console.error('Failed to fetch subscription data:', err);
      setError('Failed to fetch subscription data');
      setSubscription(defaultSubscription);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  useEffect(() => {
    fetchSubscription();
  }, [principal, isLoggedIn]);

  return {
    subscription,
    isLoading,
    error,
    refreshSubscription
  };
};

// Utility functions
export const getSubscriptionDisplayName = (type: SubscriptionType): string => {
  const names = {
    free: 'Free Member',
    premium: 'Premium Member'
  };
  return names[type];
};

export const hasFeature = (subscription: UserSubscription, feature: string): boolean => {
  return subscription.features.some(f => f.toLowerCase().includes(feature.toLowerCase()));
};

export const isSubscriptionActive = (subscription: UserSubscription): boolean => {
  if (!subscription.isActive) return false;
  if (!subscription.expirationDate) return true;
  return subscription.expirationDate > new Date();
};