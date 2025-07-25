import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Container from '@/lib/pages/components/Container';
import { getAllPolls, hasVoted } from '@/services/vote';
import { Spinner, Badge, Alert, Button, Card } from 'flowbite-react';
import { formatDate } from '@/lib/helpers/formatDate';
import { useAuth } from '@/lib/helpers/useAuth';

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
  start_date: string;
  end_date: string;
  created_at: string;
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
  const { isLoggedIn, handleLogin } = useAuth();
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
    });

  const getPollStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { text: 'Upcoming', color: 'purple' };
    if (now > end) return { text: 'Closed', color: 'red' };
    return { text: 'Active', color: 'success' };
  };

  return (
    <div className="">
      <Container>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="mb-6 bg-white border border-orange-100 shadow-sm dark:bg-white">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Filter Polls</h2>

              {/* Search Filter */}
              <div className="mb-4">
                <label htmlFor="search" className="block mb-2 text-sm font-medium text-gray-700">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Type to search..."
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Tags Filter */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      color={selectedTags.includes(tag) ? "orange" : "gray"}
                      onClick={() => toggleTag(tag)}
                      className="cursor-pointer hover:bg-orange-100 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div className="mb-4">
                <label htmlFor="date-filter" className="block mb-2 text-sm font-medium text-gray-700">
                  Created Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date-filter"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                  {dateFilter && (
                    <button
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                      onClick={() => setDateFilter('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="mb-4">
                <label htmlFor="sort" className="block mb-2 text-sm font-medium text-gray-700">
                  Sort By
                </label>
                <select
                  id="sort"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
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
                <Button
                  color="light"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTags([]);
                    setDateFilter('');
                  }}
                  className="w-full text-orange-600 hover:text-orange-800"
                >
                  Clear all filters
                </Button>
              )}
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 ">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-10">
                <Spinner size="lg" color="orange" className="mx-auto mb-4" />
                <p className="text-gray-500 text-base">Loading polls...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Alert color="failure" className="error-alert mb-6 justify-center">
                <div className="flex flex-col items-center text-center">
                  <span className="font-medium">Error loading polls</span>
                  <p className="mt-2 text-sm">{error}</p>
                  <Button
                    color="orange"
                    className="mt-4 bg-orange-100 text-orange-700 px-3 py-1"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              </Alert>
            )}

            {/* Success State */}
            {!loading && !error && (
              <>
                {/* No Results */}
                {filteredPolls.length === 0 ? (
                  <Card className="text-center py-8 bg-white border border-orange-100 dark:bg-white text-lg">
                    <p className="text-gray-500 mb-4">
                      {polls.length === 0
                        ? 'No polls available yet. Be the first to create one!'
                        : 'No polls match your current filters.'}
                    </p>
                    <div className="flex justify-center">
                      <Button
                        className='max-w-32 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 text-base'
                        color="orange"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedTags([]);
                          setDateFilter('');
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  </Card>
                ) : (
                  /* Polls List */
                  <div className="grid grid-cols-1 gap-4">
                    {filteredPolls.map((poll) => {
                      const status = getPollStatus(poll.start_date, poll.end_date);

                      return (
                        <Card
                          key={poll.id}
                          className="hover:shadow-md transition-shadow bg-white border border-orange-100 dark:bg-white "
                        >
                          {/* Status Badge */}
                          <div className="flex justify-between items-start">
                            <Badge
                              color={status.color}
                              className="mb-2"
                            >
                              {status.text}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {poll.total_votes} vote{poll.total_votes !== 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* Poll Metadata */}
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-500 mb-3">
                            <span>Start: {formatDate(poll.start_date)}</span>
                            <span>End: {formatDate(poll.end_date)}</span>
                          </div>

                          {/* Poll Question */}
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                            {poll.question}
                          </h3>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {poll.tags.map((tag) => (
                              <Badge
                                key={`${poll.id}-${tag}`}
                                color={selectedTags.includes(tag) ? "orange" : "gray"}
                                onClick={() => toggleTag(tag)}
                                className="cursor-pointer hover:bg-orange-100 transition-colors"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Action Button */}
                          <div className="flex justify-end">
                            {isLoggedIn ? (
                              <NavLink
                                to={`/votes/${poll.id}`}
                                className={`
                                  inline-flex items-center justify-center
                                  text-sm font-medium rounded-lg p-1 border
                                  transition-colors duration-200
                                  ${votedPolls[poll.id]
                                                              ? "text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200"
                                                              : "text-white bg-orange-500 border-orange-500 hover:bg-orange-600"
                                                            }
                                `}
                              >
                                {votedPolls[poll.id] ? 'View Results' : 'Vote Now'}
                              </NavLink>
                            ) : (
                              <button
                                onClick={handleLogin}
                                disabled={loading}
                                className={`
                                  inline-flex items-center justify-center
                                  text-sm font-medium rounded-lg p-1 border
                                  transition-colors duration-200
                                  text-white bg-orange-500 border-orange-500 hover:bg-orange-600
                                `}
                              >
                                {loading ? "Loading..." : "Login to Vote"}
                              </button>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
