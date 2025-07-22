import { createActor, canisterId } from '../../../../declarations/backend';

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
  totalVotes: number;
  created_at: string;
  updated_at: string;
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
  agentId: string
): Promise<Poll> => {
  const result = await backend.createPoll(question, options, tags, agentId);
  return result;
};

export const getPoll = async (id: string): Promise<Poll | null> => {
  const result = await backend.getPoll(id);
  return result?.length ? result[0] : null;
};

export const getPollsByAgent = async (agentId: string): Promise<Poll[]> => {
  return backend.getPollsByAgent(agentId);
};

export const getAllPolls = async (): Promise<Poll[]> => {
  return backend.getAllPolls();
};

export const getPollsByTag = async (tag: string): Promise<Poll[]> => {
  return backend.getPollsByTag(tag);
};

export const deletePoll = async (id: string): Promise<Poll | null> => {
  const result = await backend.deletePoll(id);
  return result?.length ? result[0] : null;
};

export const castVote = async (
  pollId: string,
  optionId: string,
  voterId: string
): Promise<Poll | null> => {
  const result = await backend.castVote(pollId, optionId, voterId);
  return result?.length ? result[0] : null;
};

export const getVotesForPoll = async (pollId: string): Promise<VoteRecord[]> => {
  return backend.getVotesForPoll(pollId);
};

export const hasVoted = async (pollId: string, voterId: string): Promise<boolean> => {
  return backend.hasVoted(pollId, voterId);
};

export const getPollOptions = async (pollId: string): Promise<PollOption[] | null> => {
  const result = await backend.getPollOptions(pollId);
  return result?.length ? result[0] : null;
};

export const getVoteCountForOption = async (
  pollId: string,
  optionId: string
): Promise<number | null> => {
  const result = await backend.getVoteCountForOption(pollId, optionId);
  return result?.length ? result[0] : null;
};

