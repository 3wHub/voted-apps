import { IDL, update, query } from 'azle';
import { PollOption, Poll, VoteRecord } from './types';
import { votesInstance,Polls } from './vote';
import { Auth } from './auth';

export default class {
  private auth: Auth;

  constructor() {
    this.auth = new Auth();
  }

  @query([])
  whoAmI(): string {
    return this.auth.getCurrentUser().toString();
  }

  @update([], IDL.Text)
  login(): string {
    const principal = this.auth.getCurrentUser();
    return `Login successful. Principal: ${principal.toString()}`;
  }

  @update([], IDL.Text)
  logout(): string {
    this.auth.logout();
    return "Logged out successfully";
  }

  @update(
    [
      IDL.Text,
      IDL.Text,
      IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
      IDL.Vec(IDL.Text),
      IDL.Text,
      IDL.Text,
      IDL.Text,
    ],
    IDL.Record({
      id: IDL.Text,
      question: IDL.Text,
      description: IDL.Text,
      options: IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
      tags: IDL.Vec(IDL.Text),
      total_votes: IDL.Nat32,
      created_at: IDL.Text,
      start_date: IDL.Text,
      end_date: IDL.Text,
      updated_at: IDL.Text,
      created_by: IDL.Text,
    })
  )
  createPoll(
    question: string,
    description: string,
    options: PollOption[],
    tags: string[],
    start_date: string,
    end_date: string,
    agentId: string
  ): Poll {
    return votesInstance.createPoll(question, description, options, tags, start_date, end_date, agentId);
  }

  @query([IDL.Text], IDL.Vec(Polls))
  getMyPolls(agentId: string): Poll[] {
    return votesInstance.getMyPolls(agentId);
  }

  @query([IDL.Text], IDL.Opt(Polls))
  getPoll(id: string): [Poll] | [] {
    return votesInstance.getPoll(id);
  }

  @query([], IDL.Vec(Polls))
  getAllPolls(): Poll[] {
    return votesInstance.getAllPolls();
  }

  @query([IDL.Text], IDL.Vec(Polls))
  getPollsByTag(tag: string): Poll[] {
    return votesInstance.getPollsByTag(tag);
  }

  @query([IDL.Text], IDL.Vec(Polls))
  getPollsByAgent(agentId: string): Poll[] {
    return votesInstance.getPollsByAgent(agentId);
  }

  @update([IDL.Text, IDL.Text], IDL.Opt(Polls))
  castVote(pollId: string, optionId: string): [Poll] | [] {
    return votesInstance.castVote(pollId, optionId);
  }

  @query([IDL.Text], IDL.Vec(IDL.Record({
    id: IDL.Text,
    pollId: IDL.Text,
    optionId: IDL.Text,
    voterId: IDL.Text,
    votedAt: IDL.Text,
  })))
  getVotesForPoll(pollId: string): VoteRecord[] {
    return votesInstance.getVotesForPoll(pollId);
  }

  @query([IDL.Text], IDL.Bool)
  hasVoted(pollId: string): boolean {
    return votesInstance.hasVoted(pollId);
  }

  @query([IDL.Text], IDL.Opt(IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 }))))
  getPollOptions(pollId: string): [PollOption[]] | [] {
    return votesInstance.getPollOptions(pollId);
  }

  @query([IDL.Text, IDL.Text], IDL.Opt(IDL.Nat32))
  getVoteCountForOption(pollId: string, optionId: string): [number] | [] {
    return votesInstance.getVoteCountForOption(pollId, optionId);
  }
}


// --- IDL Factory ---
export const idlFactory = ({ IDL }: { IDL: typeof import('azle').IDL }) => {
  const PollOption = IDL.Record({
    id: IDL.Text,
    label: IDL.Text,
    votes: IDL.Nat32,
  });

  const Poll = IDL.Record({
    id: IDL.Text,
    question: IDL.Text,
    description: IDL.Text,
    options: IDL.Vec(PollOption),
    tags: IDL.Vec(IDL.Text),
    total_votes: IDL.Nat32,
    created_at: IDL.Text,
    start_date: IDL.Text,
    end_date: IDL.Text,
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
    createPoll: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Vec(PollOption), IDL.Vec(IDL.Text), IDL.Text, IDL.Text, IDL.Text],
      [Poll],
      ['update']
    ),
    getAllPolls: IDL.Func([], [IDL.Vec(Polls)], ['query']),
    getMyPolls: IDL.Func([IDL.Text], [IDL.Vec(Polls)], ['query']),
    getPoll: IDL.Func([IDL.Text], [IDL.Opt(Polls)], ['query']),
    getPollsByTag: IDL.Func([IDL.Text], [IDL.Vec(Polls)], ['query']),
    getPollsByAgent: IDL.Func([IDL.Text], [IDL.Vec(Polls)], ['query']),
    castVote: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(Polls)], ['update']),
    getVotesForPoll: IDL.Func([IDL.Text], [IDL.Vec(VoteRecord)], ['query']),
    getPollOptions: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(PollOption))], ['query']),
    getVoteCountForOption: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(IDL.Nat32)], ['query']),
    hasVoted: IDL.Func([IDL.Text], [IDL.Bool], ['query']),
  });
};
