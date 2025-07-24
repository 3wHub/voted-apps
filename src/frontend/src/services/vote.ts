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
  const result = await backend.getPoll(id);
  return result ? result[0] : null;
};

export const getMyPolls = async (): Promise<Poll[]> => {
  const agentId = (await whoAmI()).toString();
  if (!agentId) throw new Error('Authentication required');
  const result = await backend.getMyPolls(agentId);
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
  const agentId = (await whoAmI()).toString();
  if (!agentId) throw new Error('Authentication required');
  const result = await backend.getPollsByAgent(agentId);
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
