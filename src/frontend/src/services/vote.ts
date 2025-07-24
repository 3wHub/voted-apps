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

  if (!result?.id) throw new Error('Failed to create poll');
  return result;
};

export const getPoll = async (id: string): Promise<Poll | null> => {
  try {
    const result = await backend.getPoll(id) as BackendResponse<Poll> | undefined;
    if (!result) return null;
    if (result.length === 0) return null;
    if (!result[0]) return null;

    return result[0];
  } catch (error) {
    return null;
  }
};

export const getMyPolls = async (): Promise<Poll[]> => {
  const agentId = (await whoAmI()).toString();
  if (!agentId) throw new Error('Authentication required');
  return await backend.getMyPolls(agentId) as Poll[];
};

export const getAllPolls = async (): Promise<Poll[]> => {
  return await backend.getAllPolls() as Poll[];
};

export const getPollsByTag = async (tag: string): Promise<Poll[]> => {
  return await backend.getPollsByTag(tag) as Poll[];
};

export const getPollsByAgent = async (agentId: string): Promise<Poll[]> => {
  return await backend.getPollsByAgent(agentId) as Poll[];
};

export const castVote = async (pollId: string, optionId: string): Promise<Poll | null> => {
  try {
    const result = await backend.castVote(pollId, optionId) as BackendResponse<Poll>;
    if (!result) return null;
    if (result.length === 0) return null;
    if (!result[0]) return null;
    return result[0];
  } catch (error) {
    return null;
  }
};

export const getVotesForPoll = async (pollId: string): Promise<VoteRecord[]> => {
  return await backend.getVotesForPoll(pollId) as VoteRecord[];
};

export const hasVoted = async (pollId: string): Promise<boolean> => {
  return await backend.hasVoted(pollId) as boolean;
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