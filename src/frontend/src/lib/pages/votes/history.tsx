import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '@/lib/pages/components/Container';
import { getPollsByAgent } from '@/lib/api/api';
import { Poll } from '@/lib/api/api';

export default function History() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                setLoading(true);
                const allPolls = await getPollsByAgent('u6s2n-gx777-77774-qaaba-ca');
                setPolls(allPolls);
            } catch (err) {
                console.log('Failed to fetch polls:', err);
                setError('Failed to load voting history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPolls();
    }, []);

    const filteredPolls = polls.filter(poll => {
        const now = new Date();
        const isActive = true; 
        
        if (filter === 'active' && !isActive) return false;
        if (filter === 'closed' && isActive) return false;
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                poll.question.toLowerCase().includes(query) ||
                poll.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        return true;
    });

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <Container>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Voting History</h1>
                <p className="text-gray-600">View all polls created by users</p>
            </div>

            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search polls..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('closed')}
                        className={`px-4 py-2 rounded-lg ${filter === 'closed' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Closed
                    </button>
                </div>
            </div>

            {filteredPolls.length === 0 ? (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No polls found</h3>
                    <p className="mt-1 text-gray-500">
                        {searchQuery ? 'Try a different search term' : 'Create a new poll to get started'}
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/votes/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                        >
                            Create New Poll
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPolls.map((poll) => (
                        <div key={poll.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                                        <Link to={`/vote/${poll.id}`} className="hover:text-orange-600">
                                            {poll.question}
                                        </Link>
                                    </h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${true ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {true ? 'Active' : 'Closed'}
                                    </span>
                                </div>

                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Created on {formatDate(poll.created_at)}
                                </div>

                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Total votes:</span>
                                        <span className="font-medium">{poll.totalVotes}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-orange-600 h-2 rounded-full"
                                            style={{ width: `${Math.min(100, (poll.totalVotes / 100) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {poll.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                            {tag}
                                        </span>
                                    ))}
                                    {poll.tags.length > 3 && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            +{poll.tags.length - 3}
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t">
                                    <Link
                                        to={`/vote/${poll.id}`}
                                        className="text-sm font-medium text-orange-600 hover:text-orange-500"
                                    >
                                        View details
                                    </Link>
                                    <div className="text-sm text-gray-500">
                                        {poll.options.length} options
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
}