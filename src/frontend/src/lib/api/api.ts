import { createActor, canisterId } from '../../../../declarations/backend';

const backend = createActor(canisterId);

type PollOption = {
  id: string;
  label: string;
  votes: number;
};

type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  tags: string[];
  totalVotes: number;
  created_at: string;
  updated_at: string;
};

type VoteRecord = {
  id: string;
  pollId: string;
  optionId: string;
  voterId: string;
  votedAt: string;
};

export const createPoll = async (question: string, options: PollOption[], tags: string[]): Promise<Poll> => {
  return await backend.createPoll(question, options, tags);
};

export const getPoll = async (id: string): Promise<Poll | null> => {
  const result = await backend.getPoll(id);
  return result.length ? result[0] : null;
};

export const getAllPolls = async (): Promise<Poll[]> => {
  return await backend.getAllPolls();
};

export const getPollsByTag = async (tag: string): Promise<Poll[]> => {
  return await backend.getPollsByTag(tag);
};

export const deletePoll = async (id: string): Promise<Poll | null> => {
  const result = await backend.deletePoll(id);
  return result.length ? result[0] : null;
};

// Vote-related APIs
export const castVote = async (pollId: string, optionId: string, voterId: string): Promise<Poll | null> => {
  const result = await backend.castVote(pollId, optionId, voterId);
  return result.length ? result[0] : null;
};

export const getVotesForPoll = async (pollId: string): Promise<VoteRecord[]> => {
  return await backend.getVotesForPoll(pollId);
};

export const hasVoted = async (pollId: string, voterId: string): Promise<boolean> => {
  return await backend.hasVoted(pollId, voterId);
};

// Poll options APIs
export const getPollOptions = async (pollId: string): Promise<PollOption[] | null> => {
  const result = await backend.getPollOptions(pollId);
  return result.length ? result[0] : null;
};

export const getVoteCountForOption = async (pollId: string, optionId: string): Promise<number | null> => {
  const result = await backend.getVoteCountForOption(pollId, optionId);
  return result.length ? result[0] : null;
};