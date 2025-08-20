import React from 'react';
import { AgentPlan, PlanUsage } from '@/services/plan';

interface UserBadgeProps {
    type: 'free' | 'premium';
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'compact' | 'icon-only' | 'detailed';
    className?: string;
    planInfo?: AgentPlan;
    planUsage?: PlanUsage;
    showTooltip?: boolean;
}

const UserBadge: React.FC<UserBadgeProps> = ({
    type = 'free',
    size = 'sm',
    variant = 'default',
    className = '',
    planInfo,
    planUsage,
    showTooltip = false
}) => {
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const badgeConfig = {
        free: {
            gradient: 'from-gray-400 via-gray-500 to-gray-600',
            text: 'Free',
            compactText: 'FREE',
            icon: () => (
                <svg className={`${iconSizes[size]} fill-current`} viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
            )
        },
        premium: {
            gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
            text: 'Premium',
            compactText: 'PRO',
            icon: () => (
                <svg className={`${iconSizes[size]} fill-current`} viewBox="0 0 24 24">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7-2h8.6l.9-5.4-2.1 1.7L12 8l-3.1 2.3-2.1-1.7L7.7 14z" />
                </svg>
            )
        }
    };

    const config = badgeConfig[type];
    const IconComponent = config.icon;

    if (variant === 'icon-only') {
        return (
            <div className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${config.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-200 ${sizeClasses[size]} ${className}`}>
                <IconComponent />
            </div>
        );
    }

    if (variant === 'compact') {
        const badgeElement = (
            <div className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${config.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${sizeClasses[size]} ${className}`}>
                <IconComponent />
                <span>{config.compactText}</span>
            </div>
        );

        if (showTooltip && planUsage) {
            return (
                <div className="relative group">
                    {badgeElement}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        <div className="text-center">
                            <div className="font-semibold">{config.text} Plan</div>
                            {type === 'free' && (
                                <div className="mt-1 space-y-1">
                                    <div>Polls: {planUsage.currentPolls}/{planUsage.maxPolls}</div>
                                    <div>Votes: {planUsage.currentVotesThisMonth}/{planUsage.maxVotesPerMonth}</div>
                                </div>
                            )}
                            {type === 'premium' && planInfo?.upgradedAt && (
                                <div className="mt-1">
                                    Since: {new Date(planInfo.upgradedAt).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            );
        }

        return badgeElement;
    }

    if (variant === 'detailed') {
        return (
            <div className={`inline-flex flex-col items-start gap-1 rounded-lg bg-gradient-to-r ${config.gradient} text-white p-3 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}>
                <div className="flex items-center gap-2">
                    <IconComponent />
                    <span className="font-semibold">{config.text}</span>
                </div>
                {planUsage && (
                    <div className="text-xs opacity-90 space-y-1">
                        {type === 'free' ? (
                            <>
                                <div>Polls: {planUsage.currentPolls}/{planUsage.maxPolls}</div>
                                <div>Monthly Votes: {planUsage.currentVotesThisMonth}/{planUsage.maxVotesPerMonth}</div>
                            </>
                        ) : (
                            <div>Unlimited Access</div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${config.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${sizeClasses[size]} ${className}`}>
            <IconComponent />
            <span>{config.text}</span>
            {type === 'premium' && (
                <div className="flex">
                    <svg className={`${iconSizes[size]} fill-current`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <svg className={`${iconSizes[size]} fill-current`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <svg className={`${iconSizes[size]} fill-current`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default UserBadge;
