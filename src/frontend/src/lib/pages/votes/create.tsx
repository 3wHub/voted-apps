import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button } from 'flowbite-react';
import DateTimePicker from '@/lib/pages/components/DateTimePicker';
import Container from '@/lib/pages/components/Container';
import { createPoll } from '@/services/vote';
import { VoteTemplate, voteTemplates, VoteType } from '@/types/voteTypes';
import { useUserSubscription } from '@/lib/hooks/useUserSubscription';
import { FeatureMiddleware } from '@/middleware/feature';
import { canisterId, createActor } from '../../../../../declarations/backend';

export default function CreateVote() {
    const navigate = useNavigate();
    const { subscription } = useUserSubscription();
    const isPremium = subscription?.type === 'premium';
    const [selectedTemplate, setSelectedTemplate] = useState<VoteTemplate | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
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
    const [privateLink, setPrivateLink] = useState('');
    const [contentWarning, setContentWarning] = useState('');
    const [icpIntegration, setIcpIntegration] = useState({
        enabled: false,
        tokenAmount: 0,
        walletAddress: ''
    });

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

        if (!isPremium && options.length >= 3) {
            setError("Free plan is limited to 3 options. Upgrade to Premium for more options.");
            return;
        }
        if (availableFeatures && options.length >= availableFeatures.usage.maxOptions) {
            setError(`You can only add up to ${availableFeatures.usage.maxOptions} options with your current plan.`);
            return;
        }
        setOptions([...options, '']);
    };

    const addTag = () => {
        const trimmed = newTag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            if (!isPremium && tags.length >= 2) {
                setError("Free plan is limited to 2 tags. Upgrade to Premium for more tags.");
                return;
            }

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

            // Additional validations based on template
            if (selectedTemplate) {
                const requiredFields = selectedTemplate.fields.filter(f => f.required);
                if (selectedTemplate.fields.find(f => f.name === 'location')?.required && !location) {
                    throw new Error("Location is required for this template");
                }
                if (selectedTemplate.fields.find(f => f.name === 'description')?.required && !description) {
                    throw new Error("Description is required for this template");
                }
            }

            const result = await createPoll({
                title: title.trim(),
                description: description.trim(),
                location,
                type: selectedTemplate?.id || VoteType.BASIC,
                options: options
                    .filter(opt => opt.trim())
                    .map((opt, index) => ({
                        id: `opt_${index}_${Date.now()}`,
                        label: opt.trim(),
                        votes: 0
                    })),
                tags,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });

            if (!result?.id) {
                throw new Error("Poll creation failed - no ID returned");
            }

            navigate(`/votes/history`);
        } catch (err) {
            console.error('Poll creation error:', err);
            setError(err instanceof Error ? err.message : 'Failed to create poll');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!selectedTemplate) {
        return (
            <Container>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 text-base mb-2">Create New Vote</h1>
                        <p className="text-base text-gray-600 ">
                            {isPremium
                                ? "Choose from our premium templates to create your vote"
                                : "Select a template to get started"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {voteTemplates.map((template) => (
                            <Card
                                key={template.id}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-1 hover:border-orange-300 dark:border-orange-50 dark:bg-white
                                    ${template.isPremium && !isPremium
                                        ? 'opacity-60 cursor-not-allowed bg-gray-50'
                                        : 'hover:bg-orange-50'
                                    }`}
                                onClick={() => {
                                    if (!template.isPremium || isPremium) {
                                        setSelectedTemplate(template);
                                    }
                                }}
                            >
                                <div className="text-center p-4">
                                    <div className="text-5xl mb-4">{template.icon}</div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 text-base">{template.name}</h3>
                                    <p className="text-gray-600  text-sm mb-4 leading-relaxed">{template.description}</p>
                                    <div className="flex justify-center items-center gap-2">
                                        {template.isPremium ? (
                                            <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                                                Premium
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                    {template.isPremium && !isPremium && (
                                        <div className="mt-2 text-xs text-gray-500">
                                            Upgrade to unlock
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>

                    {!isPremium && (
                        <div className="mt-12 text-center">
                            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
                                <div className="p-6">
                                    <div className="text-4xl mb-4">🚀</div>
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900 text-base">Unlock Premium Templates</h3>
                                    <p className="text-gray-600  mb-6 text-base">
                                        Get access to advanced voting templates and premium features
                                    </p>
                                    <Button
                                        color="warning"
                                        size="lg"
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                                        href="/plan"
                                    >
                                        Upgrade to Premium
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="max-w-4xl mx-auto">
                <Button
                    color="light"
                    className="mb-6 dark:bg-white dark:text-orange-900 dark:border-orange-200  dark:hover:border-orange-400 dark:hover:bg-orange-50 transition-colors"
                    onClick={() => setSelectedTemplate(null)}
                >
                    ← Back to Templates
                </Button>

                <Card className="shadow-lg border-0 dark:bg-orange-50">
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-t-lg">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">{selectedTemplate.icon}</span>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 text-base">{selectedTemplate.name}</h2>
                                <p className="text-gray-600  mt-1">{selectedTemplate.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Usage Limits Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Your Current Limits</h4>
                        <div className="text-sm text-blue-800 space-y-1">
                            <div>• {availableFeatures.usage.currentVotesThisMonth}/5 votes this month</div>
                            <div>• {availableFeatures.usage.currentVoters}/100 total voters</div>
                            <div>• {availableFeatures.usage.currentPolls}/{availableFeatures.usage.maxPolls} polls</div>
                            <div>• {options.length}/{isPremium ? availableFeatures.usage.maxOptions : 3} options</div>
                            <div>• {tags.length}/{isPremium ? availableFeatures.usage.maxTags : 2} tags</div>
                            {!isPremium && (
                                <div className="text-orange-600 font-medium mt-2">
                                    Upgrade to Premium for higher limits!
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                                <span className="text-red-500">⚠️</span>
                                {error}
                            </div>
                        )}



                        <form onSubmit={handleSubmit} className="space-y-8">
                            {selectedTemplate.fields.map((field) => (
                                <div key={field.name} className="bg-gray-50 p-4 rounded-lg border border-orange-300">
                                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>

                                    {field.type === 'text' && (
                                        <input
                                            type="text"
                                            value={field.name === 'question' ? title : ''}
                                            onChange={(e) => field.name === 'question' ? setTitle(e.target.value) : undefined}
                                            placeholder={field.placeholder}
                                            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
                                            required={field.required}
                                        />
                                    )}

                                    {field.type === 'description' && (
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Provide additional details about your vote..."
                                            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors resize-none"
                                            rows={4}
                                            required={field.required}
                                        />
                                    )}

                                    {field.type === 'location' && (
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Enter location (e.g., Conference Room A, Online, etc.)"
                                            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
                                            required={field.required}
                                        />
                                    )}

                                    {field.type === 'options' && (
                                        <div className="space-y-3">
                                            <div className="text-xs text-gray-600  mb-2">Add at least 2 options for your vote
                                                {!isPremium && (
                                                    <span className="ml-2 text-orange-600">
                                                        (Free plan limit: 3 options)
                                                    </span>
                                                )}
                                            </div>

                                            {options.map((option, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <span className="text-sm font-medium text-gray-500 min-w-[20px]">{index + 1}.</span>
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => updateOption(index, e.target.value)}
                                                        className="flex-1 p-3 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
                                                        required
                                                        placeholder={`Option ${index + 1}`}
                                                    />
                                                    {options.length > 2 && (
                                                        <Button
                                                            color="light"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                            onClick={() => removeOption(index)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                color="light"
                                                className="mt-2 border border-1 border-gray-300 hover:border-orange-300 hover:bg-orange-50"
                                                onClick={() => setOptions([...options, ''])}
                                            >
                                                + Add Another Option
                                            </Button>

                                        </div>
                                    )}

                                    {field.type === 'date' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <DateTimePicker
                                                    label="Start"
                                                    date={startDate}
                                                    onDateChange={(date) => {
                                                        if (date) setStartDate(date);
                                                    }}
                                                    time={startTime}
                                                    onTimeChange={(e) => setStartTime(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <DateTimePicker
                                                    label="End"
                                                    date={endDate}
                                                    onDateChange={(date) => {
                                                        if (date) setEndDate(date);
                                                    }}
                                                    time={endTime}
                                                    onTimeChange={(e) => setEndTime(e.target.value)}
                                                    minDate={startDate}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Tags Section */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-orange-300">
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                    Tags <span className="text-gray-500 font-normal">(Optional)</span>
                                </label>
                                <div className="text-xs text-gray-600  mb-3">Add tags to help categorize and find your vote
                                    {!isPremium && (
                                        <span className="ml-2 text-orange-600">
                                            (Free plan limit: 2 tags)
                                        </span>
                                    )}
                                </div>

                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => setTags(tags.filter(t => t !== tag))}
                                                    className="ml-2 text-orange-600 hover:text-orange-800 font-bold"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        className="flex-1 p-3 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
                                        placeholder="Type a tag and press Enter"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                    <Button
                                        color="light"
                                        onClick={addTag}
                                        disabled={!newTag.trim()}
                                        className="px-4"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>

                            {/* Premium Features Section */}
                            {availableFeatures && (
                                <div className="bg-gray-50 p-6 rounded-lg border border-orange-300">
                                    <h3 className="text-base font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                                        <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-xs px-3 py-1 rounded-full">
                                            Premium Features
                                        </span>
                                    </h3>

                                    {/* Show/Hide Percentage */}
                                    <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={showPercentage}
                                                onChange={(e) => {
                                                    if (!e.target.checked && !availableFeatures.canHidePercentage) {
                                                        setError("Hiding vote percentage is a Premium feature. Upgrade to unlock.");
                                                        return;
                                                    }
                                                    setShowPercentage(e.target.checked);
                                                }}
                                                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                                                disabled={!availableFeatures.canHidePercentage && !showPercentage}
                                            />
                                            <div>
                                                <span className="font-medium text-gray-900 text-base">Show vote percentage</span>
                                                <p className="text-sm text-gray-600  mt-1">
                                                    {showPercentage ? 'Voters will see percentage results' : 'Vote results will be hidden from voters'}
                                                </p>
                                            </div>
                                        </label>
                                        {!availableFeatures.canHidePercentage && (
                                            <div className="mt-2 text-xs text-orange-600">
                                                ✨ Premium feature - <Link to="/plan" className="underline">Upgrade to unlock</Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Private Vote */}
                                    <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isPrivate}
                                                onChange={(e) => {
                                                    if (e.target.checked && !availableFeatures.canCreatePrivateVotes) {
                                                        setError("Private voting is a Premium feature. Upgrade to unlock.");
                                                        return;
                                                    }
                                                    setIsPrivate(e.target.checked);
                                                }}
                                                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                                                disabled={!availableFeatures.canCreatePrivateVotes && !isPrivate}
                                            />
                                            <div>
                                                <span className="font-medium text-gray-900 text-base">Private vote</span>
                                                <p className="text-sm text-gray-600  mt-1">
                                                    {isPrivate ? 'Only people with the private link can vote' : 'Vote will be public'}
                                                </p>
                                            </div>
                                        </label>
                                        {isPrivate && availableFeatures.canCreatePrivateVotes && (
                                            <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                                                <span className="text-sm text-orange-800">
                                                    🔒 Private link will be generated after creation
                                                </span>
                                            </div>
                                        )}
                                        {!availableFeatures.canCreatePrivateVotes && (
                                            <div className="mt-2 text-xs text-orange-600">
                                                ✨ Premium feature - <Link to="/plan" className="underline">Upgrade to unlock</Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sensitive Content */}
                                    <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isSensitive}
                                                onChange={(e) => {
                                                    if (e.target.checked && !availableFeatures.canCreateSensitiveContent) {
                                                        setError("Sensitive content polls are a Premium feature. Upgrade to unlock.");
                                                        return;
                                                    }
                                                    setIsSensitive(e.target.checked);
                                                }}
                                                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                                                disabled={!availableFeatures.canCreateSensitiveContent && !isSensitive}
                                            />
                                            <div>
                                                <span className="font-medium text-gray-900 text-base">Sensitive content</span>
                                                <p className="text-sm text-gray-600  mt-1">
                                                    Mark this poll as containing sensitive material
                                                </p>
                                            </div>
                                        </label>
                                        {isSensitive && (
                                            <div className="mt-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Content warning
                                                </label>
                                                <input
                                                    type="text"
                                                    value={contentWarning}
                                                    onChange={(e) => setContentWarning(e.target.value)}
                                                    placeholder="Describe the sensitive content..."
                                                    className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        )}
                                        {!availableFeatures.canCreateSensitiveContent && (
                                            <div className="mt-2 text-xs text-orange-600">
                                                ✨ Premium feature - <Link to="/plan" className="underline">Upgrade to unlock</Link>
                                            </div>
                                        )}
                                    </div>


                                </div>
                            )}

                            <div className="flex justify-between items-center pt-6 border-t">
                                <Button color="light" as={Link} to="/" className="px-6">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    color="warning"
                                    disabled={isSubmitting || !title.trim() || options.filter(opt => opt.trim()).length < 2}
                                    className="px-8 bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Vote'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </Container>
    );
}
