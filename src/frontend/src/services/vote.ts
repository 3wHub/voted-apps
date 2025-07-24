import { createActor, canisterId } from '../../../declarations/backend';
import { whoAmI } from './auth';

const backend = createActor(canisterId);

export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type Poll = {
  id: string;
  question: string;
  description: string;
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

type BackendResponse<T> = [] | [T];
type BackendOptionalResponse<T> = BackendResponse<T> | undefined | null;


export const createPoll = async (
  question: string,
  description: string,
  options: PollOption[],
  tags: string[],
  start_date: string,
  end_date: string,
): Promise<Poll> => {
  try {
    const agentId = (await whoAmI()).toString();

    if (!agentId) throw new Error('Authentication required');

    const result = await backend.createPoll(
      question,
      description,
      options,
      tags,
      start_date,
      end_date,
      agentId
    );

    if (!result.id) throw new Error('Invalid response');
    return result;
  } catch (error) {
    throw error;
  }
};

export const getPoll = async (id: string): Promise<Poll | null> => {
  try {
    const result = await backend.getPoll(id);
    return result?.[0] ?? null;
  } catch (error) {
    console.error(`Failed to fetch poll ${id}:`, error);
    return null;
  }
};

export const getMyPolls = async (): Promise<Poll[]> => {
  try {
    const agentId = (await whoAmI()).toString();
    if (!agentId) return [];
    return (await backend.getMyPolls(agentId)) ?? [];
  } catch (error) {
    console.error('Failed to fetch user polls:', error);
    return [];
  }
};

export const getAllPolls = async (): Promise<Poll[]> => {
  try {
    return (await backend.getAllPolls()) ?? [];
  } catch (error) {
    console.error('Failed to fetch all polls:', error);
    return [];
  }
};

export const getPollsByAgent = async (): Promise<Poll[]> => {
  try {
    const agentId = (await whoAmI()).toString();
    const result = await backend.getMyPolls(agentId) as Poll[];
    return result;
  } catch (error) {
    return [];
  }
};

export const castVote = async (pollId: string, optionId: string): Promise<Poll | null> => {
  try {
    const agentId = (await whoAmI()).toString();
    const result = await backend.castVote(agentId,pollId, optionId);
    return result?.[0] ?? null;
  } catch (error) {
    console.error(`Failed to cast vote for poll ${pollId}:`, error);
    return null;
  }
};

export const getVotesForPoll = async (pollId: string): Promise<VoteRecord[]> => {
  return await backend.getVotesForPoll(pollId) as VoteRecord[];
};

export const hasVoted = async (pollId: string): Promise<boolean> => {
  const agentId = (await whoAmI()).toString();
  return await backend.hasVoted(agentId,pollId) as boolean;
};

export const getPollOptions = async (pollId: string): Promise<PollOption[]> => {
  try {
    const response = await backend.getPollOptions(pollId);
    const result = response as BackendOptionalResponse<PollOption[]>;

    if (!result) return [];
    if (result.length === 0) return [];

    const options = result[0];
    return Array.isArray(options) ? options : [];
  } catch (error) {
    return [];
  }
};

export const getVoteCountForOption = async (
  pollId: string,
  optionId: string
): Promise<number> => {
  try {
    const response = await backend.getVoteCountForOption(pollId, optionId);
    const result = response as BackendOptionalResponse<number>;

    if (!result) return 0;
    if (result.length === 0) return 0;

    const count = result[0];
    return typeof count === 'number' ? count : 0;
  } catch (error) {
    console.error('Error fetching vote count:', error);
    return 0;
  }
};