import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/helpers/useAuth';

export type SubscriptionType = 'free' | 'premium';

interface UserSubscription {
  type: SubscriptionType;
  isActive: boolean;
  expirationDate?: Date;
  features: string[];
}

interface UseUserSubscriptionReturn {
  subscription: UserSubscription;
  isLoading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
}

// Mock subscription data - replace with actual API calls
const mockSubscriptions: Record<string, UserSubscription> = {
  // Default free subscription for any user
  default: {
    type: 'free',
    isActive: true,
    features: [
      'Basic voting',
      'View public polls',
      'Create up to 3 polls per month',
      'Standard support'
    ]
  },
  // Premium subscription example
  premium_user: {
    type: 'premium',
    isActive: true,
    expirationDate: new Date('2024-12-31'),
    features: [
      'Unlimited voting',
      'Create unlimited polls',
      'Advanced analytics',
      'Priority support',
      'Custom themes',
      'Export data',
      'Private polls'
    ]
  }
};

export const useUserSubscription = (): UseUserSubscriptionReturn => {
  const { principal, isLoggedIn } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription>(mockSubscriptions.default);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!principal || !isLoggedIn) {
      setSubscription(mockSubscriptions.default);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock logic: check if user has premium subscription
      // In real implementation, this would be an API call
      const userKey = principal.slice(0, 10); // Use part of principal as key
      const isPremiumUser = userKey.includes('premium') || Math.random() > 0.7; // 30% chance for demo

      if (isPremiumUser) {
        setSubscription(mockSubscriptions.premium_user);
      } else {
        setSubscription(mockSubscriptions.default);
      }
    } catch (err) {
      setError('Failed to fetch subscription data');
      setSubscription(mockSubscriptions.default);
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