import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '@/lib/pages/components/FormInput';
import DateTimePicker from '@/lib/pages/components/DateTimePicker';
import Container from '@/lib/pages/components/Container';
import { createPoll } from '@/services/vote';
import { FeatureMiddleware } from '@/middleware/feature';
import { createActor, canisterId } from '../../../../../declarations/backend';

export default function CreateVote() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
    });
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('23:59');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showPercentage, setShowPercentage] = useState(true);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isSensitive, setIsSensitive] = useState(false);
    const [useTemplate, setUseTemplate] = useState(false);
    const [icpIntegration, setIcpIntegration] = useState(false);

    const [availableFeatures, setAvailableFeatures] = useState<any>(null);
    const [featureMiddleware, setFeatureMiddleware] = useState<FeatureMiddleware | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeMiddleware = async () => {
            try {
                setIsLoading(true);
                const actor = createActor(canisterId);
                const middleware = new FeatureMiddleware(actor);
                setFeatureMiddleware(middleware);

                const features = await middleware.getAvailableFeatures();
                setAvailableFeatures(features);
            } catch (error) {
                console.error('Error initializing middleware:', error);
                setError('Failed to initialize features. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        };

        initializeMiddleware();
    }, []);

    const updateOption = (index: number, value: string) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) return;
        setOptions(options.filter((_, i) => i !== index));
    };

    const addOption = () => {
        if (availableFeatures && options.length >= availableFeatures.usage.maxOptions) {
            setError(`You can only add up to ${availableFeatures.usage.maxOptions} options with your current plan.`);
            return;
        }
        setOptions([...options, '']);
    };

    const addTag = () => {
        const trimmed = newTag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            if (availableFeatures && tags.length >= availableFeatures.usage.maxTags) {
                setError(`You can only add up to ${availableFeatures.usage.maxTags} tags with your current plan.`);
                return;
            }
            setTags([...tags, trimmed]);
            setNewTag('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (!featureMiddleware) {
                throw new Error("Feature middleware not initialized. Please refresh the page.");
            }

            // Basic validation
            if (!title.trim()) {
                throw new Error("Poll title cannot be empty");
            }

            if (options.length < 2) {
                throw new Error("At least two options are required");
            }

            if (!startDate || !endDate) {
                throw new Error("Both start and end dates are required");
            }

            if (title.length > 200) {
                throw new Error("Question must be <= 200 characters");
            }

            if (description.length > 500) {
                throw new Error("Description must be <= 500 characters");
            }

            for (const tag of tags) {
                if (tag.length > 50) {
                    throw new Error("Each tag must be <= 50 characters");
                }
            }

            await featureMiddleware.validatePollCreation({
                showPercentage,
                isPrivate,
                isSensitive,
                useTemplate,
                icpIntegration: icpIntegration ? { enabled: true } : { enabled: false },
                optionsCount: options.length,
                tagsCount: tags.length
            });

            const pollOptions = options
                .filter(opt => opt.trim())
                .map((opt, index) => ({
                    id: `opt_${index}_${Date.now()}`,
                    label: opt.trim(),
                    votes: 0
                }));

            const result = await createPoll(
                title.trim(),
                description.trim(),
                pollOptions,
                tags,
                new Date(startDate).toISOString(),
                new Date(endDate).toISOString()
            );

            if (!result?.id) {
                throw new Error("Poll creation failed - no ID returned");
            }

            navigate(`/votes/history`);
        } catch (err) {
            console.error('Poll creation error:', err);
            let errorMessage = 'Failed to create poll';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state while features are being loaded
    if (isLoading || !availableFeatures || !featureMiddleware) {
        return (
            <Container>
                <div className="flex justify-center items-center py-8">
                    <div className="text-gray-500">Loading features...</div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            {/* Header with Premium Badge */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold">Create New Voting</h1>
                {availableFeatures.hasPremiumBadge && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ✨ Premium
                    </span>
                )}
            </div>

            {/* Plan Usage Information */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-700">
                    <div className="flex flex-wrap gap-4">
                        <span><strong>Plan:</strong> {availableFeatures.planInfo.plan}</span>
                        <span><strong>Polls:</strong> {availableFeatures.usage.currentPolls}/{availableFeatures.usage.maxPolls === 0 ? 'Unlimited' : availableFeatures.usage.maxPolls}</span>
                        <span><strong>Monthly Votes:</strong> {availableFeatures.usage.currentVotesThisMonth}/{availableFeatures.usage.maxVotesPerMonth === 0 ? 'Unlimited' : availableFeatures.usage.maxVotesPerMonth}</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Premium Features Section */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Poll Settings</h3>
                    <div className="space-y-3">
                        {/* Show Percentage Toggle */}
                        <div className="flex items-center">
                            <input
                                id="showPercentage"
                                type="checkbox"
                                checked={showPercentage}
                                onChange={(e) => {
                                    if (!e.target.checked && !availableFeatures.canHidePercentage) {
                                        setError('Hide vote percentages is a Premium feature. Please upgrade your plan.');
                                        return;
                                    }
                                    setShowPercentage(e.target.checked);
                                    setError(null);
                                }}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <label htmlFor="showPercentage" className="ml-2 block text-sm text-gray-900">
                                Show vote percentages
                                {!availableFeatures.canHidePercentage && (
                                    <span className="text-yellow-600 text-xs ml-1">(Premium required to hide)</span>
                                )}
                            </label>
                        </div>

                        {/* Private Poll */}
                        <div className="flex items-center">
                            <input
                                id="isPrivate"
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => {
                                    if (e.target.checked && !availableFeatures.canCreatePrivateVotes) {
                                        setError('Private polls are a Premium feature. Please upgrade your plan.');
                                        return;
                                    }
                                    setIsPrivate(e.target.checked);
                                    setError(null);
                                }}
                                disabled={!availableFeatures.canCreatePrivateVotes}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                            />
                            <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
                                Private poll (accessible only via link)
                                {!availableFeatures.canCreatePrivateVotes && (
                                    <span className="text-yellow-600 text-xs ml-1">✨ Premium feature</span>
                                )}
                            </label>
                        </div>

                        {/* Sensitive Content */}
                        <div className="flex items-center">
                            <input
                                id="isSensitive"
                                type="checkbox"
                                checked={isSensitive}
                                onChange={(e) => {
                                    if (e.target.checked && !availableFeatures.canCreateSensitiveContent) {
                                        setError('Sensitive content polls are a Premium feature. Please upgrade your plan.');
                                        return;
                                    }
                                    setIsSensitive(e.target.checked);
                                    setError(null);
                                }}
                                disabled={!availableFeatures.canCreateSensitiveContent}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                            />
                            <label htmlFor="isSensitive" className="ml-2 block text-sm text-gray-900">
                                Sensitive content (requires content warning)
                                {!availableFeatures.canCreateSensitiveContent && (
                                    <span className="text-yellow-600 text-xs ml-1">✨ Premium feature</span>
                                )}
                            </label>
                        </div>

                        {/* Template Usage */}
                        <div className="flex items-center">
                            <input
                                id="useTemplate"
                                type="checkbox"
                                checked={useTemplate}
                                onChange={(e) => {
                                    if (e.target.checked && !availableFeatures.canUseTemplates) {
                                        setError('Voting templates are a Premium feature. Please upgrade your plan.');
                                        return;
                                    }
                                    setUseTemplate(e.target.checked);
                                    setError(null);
                                }}
                                disabled={!availableFeatures.canUseTemplates}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                            />
                            <label htmlFor="useTemplate" className="ml-2 block text-sm text-gray-900">
                                Use voting template
                                {!availableFeatures.canUseTemplates && (
                                    <span className="text-yellow-600 text-xs ml-1">✨ Premium feature</span>
                                )}
                            </label>
                        </div>

                        {/* ICP Integration */}
                        <div className="flex items-center">
                            <input
                                id="icpIntegration"
                                type="checkbox"
                                checked={icpIntegration}
                                onChange={(e) => {
                                    if (e.target.checked && !availableFeatures.canUseICPIntegration) {
                                        setError('ICP coin integration is a Premium feature. Please upgrade your plan.');
                                        return;
                                    }
                                    setIcpIntegration(e.target.checked);
                                    setError(null);
                                }}
                                disabled={!availableFeatures.canUseICPIntegration}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                            />
                            <label htmlFor="icpIntegration" className="ml-2 block text-sm text-gray-900">
                                Enable ICP coin integration
                                {!availableFeatures.canUseICPIntegration && (
                                    <span className="text-yellow-600 text-xs ml-1">✨ Premium feature</span>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <FormInput
                    label="Voting Title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    // maxLength={200}
                />

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        maxLength={500}
                        className="mt-1 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-1 border"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        {description.length}/500 characters
                    </div>
                </div>

                {/* Voting Options */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        Voting Options (Max: {availableFeatures.usage.maxOptions || 'Loading...'})
                    </label>
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                className="flex-1 text-sm py-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-1 border"
                                required
                                maxLength={100}
                                placeholder={`Option ${index + 1}`}
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addOption}
                        disabled={availableFeatures && options.length >= availableFeatures.usage.maxOptions}
                        className="mt-2 text-sm text-orange-600 hover:text-orange-800 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Option
                        {availableFeatures && options.length >= availableFeatures.usage.maxOptions && (
                            <span className="text-xs text-gray-500 ml-1">(Limit reached)</span>
                        )}
                    </button>
                </div>

                {/* Tags */}
                <div>
                    <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900">
                        Tags (Max: {availableFeatures.usage.maxTags || 'Loading...'})
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => setTags(tags.filter(t => t !== tag))}
                                    className="ml-1.5 inline-flex text-orange-400 hover:text-orange-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            id="tags"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            maxLength={50}
                            placeholder="Enter a tag"
                            className="flex-1 text-sm py-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-1 border"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            disabled={(availableFeatures && tags.length >= availableFeatures.usage.maxTags) || !newTag.trim()}
                            className="ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DateTimePicker
                        label="Start Date"
                        date={startDate}
                        onDateChange={(date) => {
                            if (date) setStartDate(date);
                        }}
                        time={startTime}
                        onTimeChange={(e) => setStartTime(e.target.value)}
                    />
                    <DateTimePicker
                        label="End Date"
                        date={endDate}
                        onDateChange={(date) => {
                            if (date) setEndDate(date);
                        }}
                        time={endTime}
                        onTimeChange={(e) => setEndTime(e.target.value)}
                        minDate={startDate}
                    />
                </div>

                {/* Upgrade Prompt for Free Users */}
                {availableFeatures.planInfo.plan === 'free' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-yellow-800 mb-2">✨ Upgrade to Premium</h3>
                        <p className="text-sm text-yellow-700 mb-3">
                            Unlock private polls, hide percentages, sensitive content, templates, ICP integration, and unlimited features!
                        </p>
                        <button
                            type="button"
                            className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                            onClick={() => navigate('/premium')}
                        >
                            Learn More →
                        </button>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                    <Link to="/" className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Voting'}
                    </button>
                </div>
            </form>
        </Container>
    );
}