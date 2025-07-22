
import { IDL, update, query } from 'azle';
import { PollOption, Poll, VoteRecord } from './types';
import { Votes } from './vote';
import { Auth } from './auth';

export default class {
  private votes = new Votes();
  private auth = new Auth();

  @query([])
  whoAmI(): string {
    return this.auth.getCurrentUser().toString();
  }

  @update()
  login(): string {
    const principal = this.auth.getCurrentUser();
    return `Login successful. Principal: ${principal.toString()}`;
  }

  @update()
  logout(): string {
    this.auth.logout();
    return "Logged out successfully";
  }

  @update([IDL.Text, IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })), IDL.Vec(IDL.Text)])
  createPoll(question: string, options: PollOption[], tags: string[]): Poll {
    return this.votes.createPoll(question, options, tags);
  }

  @query([])
  getMyPolls(): Poll[] {
    return this.votes.getMyPolls();
  }

  @query([IDL.Text])
  getPoll(id: string): [] | [Poll] {
    return this.votes.getPoll(id);
  }

  @query([])
  getAllPolls(): Poll[] {
    return this.votes.getAllPolls();
  }

  @query([IDL.Text])
  getPollsByTag(tag: string): Poll[] {
    return this.votes.getPollsByTag(tag);
  }

  @query([])
  getPollsByAgent([]): Poll[] {
    const result = this.votes.getPollsByAgent();
    return result || [];
  }

  @update([IDL.Text, IDL.Text])
  castVote(pollId: string, optionId: string): [Poll] | [] {
    return this.votes.castVote(pollId, optionId);
  }

  @query([IDL.Text])
  getVotesForPoll(pollId: string): VoteRecord[] {
    return this.votes.getVotesForPoll(pollId);
  }

  @query([IDL.Text])
  hasVoted(pollId: string): boolean {
    return this.votes.hasVoted(pollId);
  }

  @query([IDL.Text])
  getPollOptions(pollId: string): [] | [PollOption[]] {
    return this.votes.getPollOptions(pollId);
  }

  @query([IDL.Text, IDL.Text])
  getVoteCountForOption(pollId: string, optionId: string): [] | [number] {
    return this.votes.getVoteCountForOption(pollId, optionId);
  }
}

export const idlFactory = ({ IDL }: { IDL: any }) => {
  const PollOption = IDL.Record({
    id: IDL.Text,
    label: IDL.Text,
    votes: IDL.Nat32,
  });

  const Poll = IDL.Record({
    id: IDL.Text,
    question: IDL.Text,
    options: IDL.Vec(PollOption),
    tags: IDL.Vec(IDL.Text),
    total_votes: IDL.Nat32,
    created_at: IDL.Text,
    updated_at: IDL.Text,
    created_by: IDL.Text,
  });

  const VoteRecord = IDL.Record({
    id: IDL.Text,
    pollId: IDL.Text,
    optionId: IDL.Text,
    voterId: IDL.Text,
    votedAt: IDL.Text,
  });

  return IDL.Service({
    whoAmI: IDL.Func([], [IDL.Text], ['query']),
    login: IDL.Func([], [IDL.Text], ['update']),
    logout: IDL.Func([], [IDL.Text], ['update']),
    createPoll: IDL.Func([IDL.Text, IDL.Vec(PollOption), IDL.Vec(IDL.Text)], [Poll], ['update']),
    getMyPolls: IDL.Func([], [IDL.Vec(Poll)], ['query']),
    getPoll: IDL.Func([IDL.Text], [IDL.Opt(Poll)], ['query']),
    getAllPolls: IDL.Func([], [IDL.Vec(Poll)], ['query']),
    getPollsByTag: IDL.Func([IDL.Text], [IDL.Vec(Poll)], ['query']),
    getPollsByAgent: IDL.Func([IDL.Text], [IDL.Vec(Poll)], ['query']),
    castVote: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(Poll)], ['update']),
    getVotesForPoll: IDL.Func([IDL.Text], [IDL.Vec(VoteRecord)], ['query']),
    hasVoted: IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    getPollOptions: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(PollOption))], ['query']),
    getVoteCountForOption: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(IDL.Nat32)], ['query']),
  });
};