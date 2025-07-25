import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Container from '@/lib/pages/components/Container';
import { getAllPolls, hasVoted } from '@/services/vote';
import { Spinner } from 'flowbite-react';

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  tags: string[];
  total_votes: number;
  created_at: string;
  updated_at: string;
  options: PollOption[];
}

type SortOptionValue = "newest" | "oldest" | "mostVotes" | "leastVotes";

const sortOptions: { value: SortOptionValue; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "mostVotes", label: "Most Votes" },
  { value: "leastVotes", label: "Least Votes" },
];


export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOptionValue>("newest");
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votedPolls, setVotedPolls] = useState<Record<string, boolean>>({});



  useEffect(() => {
    let isMounted = true;

    const fetchPolls = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getAllPolls();
        if (isMounted) {
          setPolls(result);
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Failed to fetch polls');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPolls();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const checkVotes = async () => {
      const results: Record<string, boolean> = {};

      for (const poll of polls) {
        results[poll.id] = await hasVoted(poll.id);
      }

      setVotedPolls(results);
    };

    checkVotes();
  }, [polls]);

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
          return b.total_votes - a.total_votes;
        case 'leastVotes':
          return a.total_votes - b.total_votes;
        default:
          return 0;
      }
    })


  return (
    <Container>
      {/* Filters Section */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Filter Polls</h2>

        {/* Search Filter */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Type to search..."
            className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tags Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${selectedTags.includes(tag)
                  ? 'bg-blue-100 text-blue-800 border-blue-400 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
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
          <div className="flex items-center gap-2">
            <input
              type="date"
              id="date-filter"
              className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setDateFilter('')}
                aria-label="Clear date filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>

              </button>
            )}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="mb-4">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort"
            className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOptionValue)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear All Filters */}
        {(searchTerm || selectedTags.length > 0 || dateFilter) && (
          <div className="mt-4">
            <button
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
              onClick={() => {
                setSearchTerm('');
                setSelectedTags([]);
                setDateFilter('');
                setSortBy('newest');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>

              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Polls List Section */}
      <div className="grid grid-cols-1 gap-5">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <Spinner className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-gray-500">Loading polls...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>

            <p className="mt-2 text-red-500">Error: {error}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Success State */}
        <div className="text-base">
          {!loading && !error && (
            <>
              {/* No Results */}
              {filteredPolls.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">
                    {polls.length === 0
                      ? 'No polls available yet. Be the first to create one!'
                      : 'No polls match your current filters.'}
                  </p>
                  <button
                    className="mt-4 px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTags([]);
                      setDateFilter('');
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                /* Polls List */
                filteredPolls.map((poll) => (
                  <div
                    key={poll.id}
                    className="block p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md bg-white transition-all duration-200"
                  >
                    {/* Poll Metadata */}
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-gray-500">
                        {new Date(poll.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {poll.created_at && (
                        <span className="text-xs text-gray-500">
                          {poll.created_at}
                        </span>
                      )}
                    </div>

                    {/* Poll Question */}
                    <h3 className="mt-2 mb-3 text-xl font-semibold text-gray-900">
                      {poll.question}
                    </h3>

                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {poll.tags.map((tag) => (
                        <button
                          key={`${poll.id}-${tag}`}
                          type="button"
                          className={`py-1.5 px-3 text-xs font-medium rounded-full border transition-colors ${selectedTags.includes(tag)
                            ? 'bg-gray-800 text-white border-gray-800'
                            : 'text-gray-900 bg-white border-gray-200 hover:bg-gray-100'
                            }`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {poll.total_votes} vote{poll.total_votes !== 1 ? 's' : ''}
                      </span>
                      <NavLink
                        to={`/votes/${poll.id}`}
                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                      >
                        {votedPolls[poll.id] ? 'View Results' : 'Vote Now'}
                      </NavLink>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
