import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Container from '@/lib/pages/components/Container';
import { getPoll, castVote } from '@/lib/api/api';

interface PollOption {
    id: string;
    label: string;
    votes: number;
}

interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    tags: string[];
    totalVotes: number;
    created_at: string;
    updated_at: string;
}

export default function Vote() {
    const { id } = useParams();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        console.log('Fetching poll with ID:', id);
        if (!id) return;
        const fetchPoll = async () => {
            try {
                const data = await getPoll(id);
                console.log('Poll data:', data);
                setPoll(data);
            } catch (err) {
                console.log('Poll data:', err);
                console.error('Failed to fetch poll:', err);
            } finally {
                console.log('Poll final');
                setLoading(false);
            }
        };
        fetchPoll();
    }, [id]);

    const handleVoteSubmit = async () => {
        if (!selectedOption || !poll) return;

        const voterId = 'dummy-voter-id';

        try {
            const updatedPoll = await castVote(poll.id, selectedOption, voterId);
            if (updatedPoll) {
                setPoll(updatedPoll);
                setHasVoted(true);
            }
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const handleOptionChange = (optionId: string) => {
        setSelectedOption(optionId);
    };

    const calculatePercentage = (votes: number) => {
        const total = poll?.options.reduce((sum, option) => sum + option.votes, 0) ?? 0;
        return total > 0 ? Math.round((votes / total) * 100) : 0;
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Loading poll...</div>;
    }

    if (!poll) {
        return (
            <div className="flex justify-center p-10">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Poll not found</h2>
                    <p className="mt-2 text-gray-600">The requested poll does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <Container>
            <div className="block p-6 mb-5 border border-gray-200 rounded-lg shadow-sm bg-white">
                <span className="text-sm text-gray-500">
                    Created: {new Date(poll.created_at).toLocaleDateString()}
                </span>
                <div className="flex justify-between items-start mb-4">
                    <h5 className="text-2xl font-light text-gray-900">{poll.question}</h5>
                </div>

                {poll.tags.length > 0 && (
                    <div className="mb-4">
                        {poll.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-block bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full mr-2 mb-2"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg mb-4">
                    {poll.options.map((option) => (
                        <li key={option.id} className="w-full border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center ps-3">
                                <input
                                    id={`${poll.id}-${option.id}`}
                                    type="radio"
                                    name={`poll-${poll.id}`}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                    onChange={() => handleOptionChange(option.id)}
                                    disabled={hasVoted}
                                    checked={selectedOption === option.id}
                                />
                                <label
                                    htmlFor={`${poll.id}-${option.id}`}
                                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{option.label}</span>
                                        {hasVoted && (
                                            <span className="text-xs font-normal text-gray-500">
                                                {calculatePercentage(option.votes)}%
                                            </span>
                                        )}
                                    </div>
                                    {hasVoted && (
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                            <div
                                                className="bg-blue-600 h-1.5 rounded-full"
                                                style={{ width: `${calculatePercentage(option.votes)}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-col mt-4 items-center">
                    {!hasVoted ? (
                        <button
                            type="button"
                            className={`text-white font-medium rounded-lg text-sm px-5 py-3 focus:outline-none focus:ring-4 max-w-lg ${selectedOption
                                ? 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            onClick={handleVoteSubmit}
                            disabled={!selectedOption}
                        >
                            Submit Vote
                        </button>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-green-600 font-medium">Thank you for voting!</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Total votes: {poll.options.reduce((sum, option) => sum + option.votes, 0)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}
