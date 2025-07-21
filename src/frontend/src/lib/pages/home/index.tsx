import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Container from '@/lib/pages/components/Container';
import { getAllPolls } from '@/lib/api/api';

interface PollOption {
    id: string;
    label: string;
    votes: number;
}

interface Poll {
    id: string;
    question: string;
    tags: string[];
    totalVotes: number;
    created_at: string;
    updated_at: string;
    options: PollOption[];
}

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostVotes'>('newest');
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const result = await getAllPolls();
                setPolls(result);
            } catch (error) {
                console.error('Failed to fetch polls:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPolls();
    }, []);

    const allTags = Array.from(new Set(polls.flatMap((poll) => poll.tags)));

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const filteredPolls = polls
        .filter((poll) => {
            const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTags =
                selectedTags.length === 0 || selectedTags.every((tag) => poll.tags.includes(tag));
            const matchesDate = dateFilter
                ? new Date(poll.created_at).toISOString().slice(0, 10) === dateFilter
                : true;

            return matchesSearch && matchesTags && matchesDate;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'oldest':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'mostVotes':
                    return b.totalVotes - a.totalVotes;
            }
        });

    return (
        <Container>
            {/* Filters */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Filter Polls</h2>

                {/* Search */}
                <div className="mb-4">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                    </label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Type to search..."
                        className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tags */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1.5 text-xs rounded-full border ${selectedTags.includes(tag)
                                        ? 'bg-blue-100 text-blue-800 border-blue-400'
                                        : 'bg-gray-100 text-gray-800 border-gray-300'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Filter */}
                <div className="mb-4">
                    <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date-filter"
                        className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                    {dateFilter && (
                        <button
                            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                            onClick={() => setDateFilter('')}
                        >
                            Clear date filter
                        </button>
                    )}
                </div>

                {/* Sort Filter */}
                <div className="mb-4">
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                    </label>
                    <select
                        id="sort"
                        className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="mostVotes">Most Votes</option>
                    </select>
                </div>

                {/* Clear All Filters */}
                <div className="mt-4">
                    <button
                        className="text-sm text-red-500 hover:underline"
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedTags([]);
                            setDateFilter('');
                            setSortBy('newest');
                        }}
                    >
                        Clear all filters
                    </button>
                </div>
            </div>

            {/* Polls List */}
            <div className="grid grid-cols-1 gap-5">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading polls...</div>
                ) : filteredPolls.length > 0 ? (
                    filteredPolls.map((poll) => (
                        <div
                            key={poll.id}
                            className="block p-6 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 bg-white"
                        >
                            <span className="text-xs text-gray-500">
                                {new Date(poll.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex justify-between items-start">
                                <h5 className="mb-3 text-xl font-light text-gray-900">{poll.question}</h5>
                            </div>

                            <div className="mb-4 flex flex-wrap gap-2">
                                {poll.tags.map((tag, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="py-1.5 px-3 text-xs font-medium rounded-full text-gray-900 bg-white border border-gray-200 hover:bg-gray-100"
                                        onClick={() => toggleTag(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">{poll.totalVotes} votes</span>
                                <NavLink
                                    to={`/votes/${poll.id}`}
                                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                >
                                    Vote
                                </NavLink>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No polls match your filters.</p>
                    </div>
                )}
            </div>
        </Container>
    );
}
