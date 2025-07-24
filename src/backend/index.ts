import { IDL, update, query } from 'azle';
import { PollOption, Poll, VoteRecord } from './types';
import { PollsIdl, PollOptionIdl, VoteRecordIdl, IDLType } from './types/idl';
import { votesInstance } from './vote';
import { authInstance } from './auth';

export default class VotingBackend {
  @query([])
  whoAmI(): string {
    return authInstance.getCurrentUser().toString();
  }

  @update([], IDL.Text)
  login(): string {
    const principal = authInstance.getCurrentUser();
    return `Login successful. Principal: ${principal.toString()}`;
  }

  @update([], IDL.Text)
  logout(): string {
    authInstance.logout();
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
    PollsIdl
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
    return votesInstance.createPoll(
      question,
      description,
      options,
      tags,
      start_date,
      end_date,
      agentId
    );
  }

  @query([IDL.Text], IDL.Vec(PollsIdl))
  getMyPolls(agentId: string): Poll[] {
    return votesInstance.getMyPolls(agentId);
  }

  @query([IDL.Text], IDL.Opt(PollsIdl))
  getPoll(id: string): [] | [Poll] {
    return votesInstance.getPoll(id);
  }

  @query([], IDL.Vec(PollsIdl))
  getAllPolls(): Poll[] {
    return votesInstance.getAllPolls();
  }

  @query([IDL.Text], IDL.Vec(PollsIdl))
  getPollsByTag(tag: string): Poll[] {
    return votesInstance.getPollsByTag(tag);
  }

  @query([IDL.Text], IDL.Vec(PollsIdl))
  getPollsByAgent(agentId: string): Poll[] {
    return votesInstance.getPollsByAgent(agentId);
  }

  @update([IDL.Text, IDL.Text, IDL.Text], IDL.Opt(PollsIdl))
  castVote(agentId: string, pollId: string, optionId: string): [] | [Poll] {
    return votesInstance.castVote(agentId, pollId, optionId);
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

  @query([IDL.Text, IDL.Text], IDL.Bool)
  hasVoted(agentId: string, pollId: string): boolean {
    return votesInstance.hasVoted(agentId, pollId);
  }

  @query([IDL.Text], IDL.Opt(IDL.Vec(IDL.Record({
    id: IDL.Text,
    label: IDL.Text,
    votes: IDL.Nat32
  }))))
  getPollOptions(pollId: string): [] | [PollOption[]] {
    return votesInstance.getPollOptions(pollId);
  }

  @query([IDL.Text, IDL.Text], IDL.Opt(IDL.Nat32))
  getVoteCountForOption(pollId: string, optionId: string): [] | [number] {
    return votesInstance.getVoteCountForOption(pollId, optionId);
  }
}

export const idlFactory = ({ IDL }: { IDL: IDLType }) => {
  return IDL.Service({
    whoAmI: IDL.Func([], [IDL.Text], ['query']),
    login: IDL.Func([], [IDL.Text], ['update']),
    logout: IDL.Func([], [IDL.Text], ['update']),
    createPoll: IDL.Func(
      [
        IDL.Text,
        IDL.Text,
        IDL.Vec(PollOptionIdl),
        IDL.Vec(IDL.Text),
        IDL.Text,
        IDL.Text,
        IDL.Text
      ],
      [PollsIdl],
      ['update']
    ),
    getAllPolls: IDL.Func([], [IDL.Vec(PollsIdl)], ['query']),
    getMyPolls: IDL.Func([IDL.Text], [IDL.Vec(PollsIdl)], ['query']),
    getPoll: IDL.Func([IDL.Text], [IDL.Opt(PollsIdl)], ['query']),
    getPollsByTag: IDL.Func([IDL.Text], [IDL.Vec(PollsIdl)], ['query']),
    getPollsByAgent: IDL.Func([IDL.Text], [IDL.Vec(PollsIdl)], ['query']),
    castVote: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(PollsIdl)], ['update']),
    getVotesForPoll: IDL.Func([IDL.Text], [IDL.Vec(VoteRecordIdl)], ['query']),
    getPollOptions: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(PollOptionIdl))], ['query']),
    getVoteCountForOption: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(IDL.Nat32)], ['query']),
    hasVoted: IDL.Func([IDL.Text], [IDL.Bool], ['query']),
  });
};