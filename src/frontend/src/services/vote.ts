import { createActor, canisterId } from '../../../declarations/backend';

const backend = createActor(canisterId);

export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  tags: string[];
  total_votes: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
};

export type VoteRecord = {
  id: string;
  pollId: string;
  optionId: string;
  voterId: string;
  votedAt: string;
};

export const createPoll = async (
  question: string,
  options: PollOption[],
  tags: string[],
  start_date: string,
  end_date: string,
): Promise<Poll> => {
  try {
    if (!question.trim()) {
      throw new Error('Poll question cannot be empty');
    }
    if (options.length < 2) {
      throw new Error('At least two options are required');
    }
    if (!start_date || !end_date) {
      throw new Error('Both start and end dates are required');
    }
    if (new Date(start_date) >= new Date(end_date)) {
      throw new Error('End date must be after start date');
    }

    const result = await backend.createPoll(
      question,
      options,
      tags.filter(t => t.trim()),
      start_date,
      end_date
    );
    console.log('Raw response:', result);

    if (!result) {
      throw new Error('Poll creation failed - no ID returned from server');
    }

    return result;
  } catch (error) {
    console.error('Full error:', error);
    if (error instanceof Error) {
      if (error.message.includes('unexpected end of buffer')) {
        throw new Error('Data format mismatch with backend. Please check the API contract.');
      }
      throw error; 
    }
    throw new Error('Failed to create poll due to an unknown error');
  }
};

export const getPoll = async (id: string): Promise<Poll | null> => {
  const result = await backend.getPoll(id);
  return result ? result[0] : null;
};

export const getMyPolls = async (): Promise<Poll[]> => {
  const result = await backend.getMyPolls();
  return result ?? [];
};

export const getAllPolls = async (): Promise<Poll[]> => {
  const result = await backend.getAllPolls();
  return result ?? [];
};

export const getPollsByTag = async (tag: string): Promise<Poll[]> => {
  const result = await backend.getPollsByTag(tag);
  return result ?? [];
};

export const getPollsByAgent = async (): Promise<Poll[]> => {
  const result = await backend.getPollsByAgent();
  return result ?? [];
};

export const castVote = async (pollId: string, optionId: string): Promise<Poll | null> => {
  const result = await backend.castVote(pollId, optionId);
  return result ? result[0] : null;
};

export const getVotesForPoll = async (pollId: string): Promise<VoteRecord[]> => {
  const result = await backend.getVotesForPoll(pollId);
  return result ?? [];
};

export const hasVoted = async (pollId: string): Promise<boolean> => {
  const result = await backend.hasVoted(pollId);
  return result ?? false;
};

export const getPollOptions = async (pollId: string): Promise<PollOption[]> => {
  const result = await backend.getPollOptions(pollId);
  return result ?? [];
};

export const getVoteCountForOption = async (pollId: string, optionId: string): Promise<number> => {
  const result = await backend.getVoteCountForOption(pollId, optionId);
  return result ? result[0] : 0;
};
