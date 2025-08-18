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

export type PlanType = 'free' | 'premium';

export type AgentPlan = {
  plan: PlanType;
  upgradedAt: [] | [string];
  voteCount: number;
  lastVoteReset: string;
  voterCount: number;
};
export type PlanLimits = {
  maxPolls: number;
  maxOptions: number;
  maxTags: number;
  maxVotesPerMonth: number;
  maxVoters: number;
};

export type PlanUsage = {
  maxPolls: number;
  maxOptions: number;
  maxTags: number;
  currentPolls: number;
  maxVotesPerMonth: number;
  currentVotesThisMonth: number;
  maxVoters: number;
  currentVoters: number;
};
