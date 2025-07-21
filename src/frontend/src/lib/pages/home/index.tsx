import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Container from '@/lib/pages/components/Container';

interface Poll {
    id: number;
    question: string;
    tags: string[];
    totalVotes: number;
    created_at: string;
}

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('');

    const data: Poll[] = [
        {
            id: 1,
            question: "Siapa presiden Indonesia terbaik sepanjang sejarah peradaban manusia modern?",
            tags: ["Politik", "Sejarah", "Kepemimpinan"],
            totalVotes: 245,
            created_at: "2025-07-15"
        },
        {
            id: 2,
            question: "Aplikasi mobile banking apa yang paling aman menurut Anda?",
            tags: ["Teknologi", "Keuangan", "Keamanan"],
            totalVotes: 189,
            created_at: "2025-07-18"
        },
        {
            id: 3,
            question: "Destinasi wisata mana yang paling ingin Anda kunjungi di Indonesia?",
            tags: ["Travel", "Budaya", "Alam"],
            totalVotes: 312,
            created_at: "2025-07-20"
        },
        {
            id: 4,
            question: "Makanan tradisional Indonesia mana yang paling Anda sukai?",
            tags: ["Kuliner", "Budaya"],
            totalVotes: 421,
            created_at: "2025-07-10"
        },
        {
            id: 5,
            question: "Platform e-commerce mana yang paling sering Anda gunakan?",
            tags: ["Teknologi", "Belanja"],
            totalVotes: 376,
            created_at: "2025-07-19"
        }
    ];

    const allTags = Array.from(new Set(data.flatMap(poll => poll.tags)));

    const filteredPolls = data.filter(poll => {
        const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag ? poll.tags.includes(selectedTag) : true;
        const matchesDate = dateFilter ? poll.created_at === dateFilter : true;

        return matchesSearch && matchesTag && matchesDate;
    });

    return (
        <Container>
            {/* Search and Filter Section */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Filter Polls</h2>

                {/* Search by title */}
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

                {/* Filter by tag */}
                <div className="mb-4">
                    <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Tag
                    </label>
                    <select
                        id="tag-filter"
                        className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                    >
                        <option value="">All Tags</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>

                {/* Filter by date */}
                <div>
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
            </div>

            {/* Polls List */}
            <div className="grid grid-cols-1 gap-5">
                {filteredPolls.length > 0 ? (
                    filteredPolls.map((poll) => (
                        <div key={poll.id} className="block p-6 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
                            <span className="text-xs text-gray-500">
                                {new Date(poll.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex justify-between items-start">
                                <h5 className="mb-3 text-xl font-light text-gray-900">
                                    {poll.question}
                                </h5>
                            </div>

                            <div className="mb-4">
                                {poll.tags.map((category, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="py-1.5 px-3 me-2 mb-2 text-xs font-medium rounded-full text-gray-900 bg-white border border-gray-200 hover:bg-gray-100"
                                        onClick={() => setSelectedTag(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    {poll.totalVotes} votes
                                </span>
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
                        <button
                            className="mt-2 text-blue-500 hover:text-blue-700"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedTag('');
                                setDateFilter('');
                            }}
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </Container>
    );
}