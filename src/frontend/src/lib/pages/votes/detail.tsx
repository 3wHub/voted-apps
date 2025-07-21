import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Container from '@/lib/pages/components/Container';
import { getPoll } from '@/lib/api/api';

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

export default function DetailVote() {
  const { id } = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPoll = async () => {
      try {
        const data = await getPoll(id);
        setPoll(data);
      } catch (err) {
        console.error('Failed to fetch poll:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

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
              <div className="flex justify-between px-4 py-3 items-center">
                <span>{option.label}</span>
                <span className="text-xs text-gray-500">{calculatePercentage(option.votes)}%</span>
              </div>
              <div className="px-4 pb-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${calculatePercentage(option.votes)}%` }}
                  ></div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="text-sm text-center text-gray-600">
          Total votes: {poll.totalVotes}
        </div>
      </div>
    </Container>
  );
}
