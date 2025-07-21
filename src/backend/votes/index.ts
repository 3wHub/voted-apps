import { IDL, StableBTreeMap, update, query } from 'azle';
import { v4 as uuidv4 } from 'uuid';

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

export default class PollCanister {
  private polls = new StableBTreeMap<string, Poll>(0);
  private votes = new StableBTreeMap<string, VoteRecord>(1);
  private voterRecords = new StableBTreeMap<string, Set<string>>(2);

  @update(
    [
      IDL.Text,
      IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
      IDL.Vec(IDL.Text),
    ],
    IDL.Record({
      id: IDL.Text,
      question: IDL.Text,
      options: IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
      tags: IDL.Vec(IDL.Text),
      totalVotes: IDL.Nat32,
      created_at: IDL.Text,
      updated_at: IDL.Text,
    }),
  )
  createPoll(question: string, options: PollOption[], tags: string[]): Poll {
    const now = new Date().toISOString();
    const poll: Poll = {
      id: uuidv4(),
      question,
      options: options.map((opt) => ({ ...opt, votes: 0 })),
      tags,
      totalVotes: 0,
      created_at: now,
      updated_at: now,
    };
    this.polls.insert(poll.id, poll);
    return poll;
  }

  @query(
    [IDL.Text],
    IDL.Opt(
      IDL.Record({
        id: IDL.Text,
        question: IDL.Text,
        options: IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
        tags: IDL.Vec(IDL.Text),
        totalVotes: IDL.Nat32,
        created_at: IDL.Text,
        updated_at: IDL.Text,
      }),
    ),
  )
  getPoll(id: string): [] | [Poll] {
    const poll = this.polls.get(id);
    return poll ? [poll] : [];
  }

  @query(
    [],
    IDL.Vec(
      IDL.Record({
        id: IDL.Text,
        question: IDL.Text,
        options: IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
        tags: IDL.Vec(IDL.Text),
        totalVotes: IDL.Nat32,
        created_at: IDL.Text,
        updated_at: IDL.Text,
      }),
    ),
  )
  getAllPolls(): Poll[] {
    return this.polls.values();
  }

  @query(
    [IDL.Text],
    IDL.Vec(
      IDL.Record({
        id: IDL.Text,
        question: IDL.Text,
        options: IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
        tags: IDL.Vec(IDL.Text),
        totalVotes: IDL.Nat32,
        created_at: IDL.Text,
        updated_at: IDL.Text,
      }),
    ),
  )
  getPollsByTag(tag: string): Poll[] {
    return this.polls.values().filter((poll) => poll.tags.includes(tag));
  }

  @update(
    [IDL.Text, IDL.Text, IDL.Text],
    IDL.Opt(
      IDL.Record({
        id: IDL.Text,
        question: IDL.Text,
        options: IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
        tags: IDL.Vec(IDL.Text),
        totalVotes: IDL.Nat32,
        created_at: IDL.Text,
        updated_at: IDL.Text,
      }),
    ),
  )
  castVote(pollId: string, optionId: string, voterId: string): [] | [Poll] {
    // Check if voter already voted in this poll
    const voterPolls = this.voterRecords.get(voterId) ?? new Set();
    if (voterPolls.has(pollId)) {
      throw new Error('You have already voted in this poll');
    }

    const pollOpt = this.polls.get(pollId);
    if (!pollOpt) return [];

    const optionIndex = pollOpt.options.findIndex((opt) => opt.id === optionId);
    if (optionIndex === -1) return [];

    const updatedPoll: Poll = {
      ...pollOpt,
      options: [...pollOpt.options],
      totalVotes: pollOpt.totalVotes + 1,
      updated_at: new Date().toISOString(),
    };

    updatedPoll.options[optionIndex] = {
      ...updatedPoll.options[optionIndex],
      votes: updatedPoll.options[optionIndex].votes + 1,
    };

    const voteId = uuidv4();
    this.votes.insert(voteId, {
      id: voteId,
      pollId,
      optionId,
      voterId,
      votedAt: new Date().toISOString(),
    });

    voterPolls.add(pollId);
    this.voterRecords.insert(voterId, voterPolls);

    this.polls.insert(pollId, updatedPoll);

    return [updatedPoll];
  }

  @query(
    [IDL.Text],
    IDL.Vec(
      IDL.Record({
        id: IDL.Text,
        pollId: IDL.Text,
        optionId: IDL.Text,
        voterId: IDL.Text,
        votedAt: IDL.Text,
      }),
    ),
  )
  getVotesForPoll(pollId: string): VoteRecord[] {
    return this.votes.values().filter((vote) => vote.pollId === pollId);
  }

  @query([IDL.Text, IDL.Text], IDL.Bool)
  hasVoted(pollId: string, voterId: string): boolean {
    const voterPolls = this.voterRecords.get(voterId);
    return voterPolls ? voterPolls.has(pollId) : false;
  }

  @query(
    [IDL.Text],
    IDL.Opt(IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 }))),
  )
  getPollOptions(pollId: string): [] | [PollOption[]] {
    const poll = this.polls.get(pollId);
    return poll ? [poll.options] : [];
  }

  @query([IDL.Text, IDL.Text], IDL.Opt(IDL.Nat32))
  getVoteCountForOption(pollId: string, optionId: string): [] | [number] {
    const poll = this.polls.get(pollId);
    if (!poll) return [];

    const option = poll.options.find((opt) => opt.id === optionId);
    return option ? [option.votes] : [];
  }

  @update(
    [IDL.Text],
    IDL.Opt(
      IDL.Record({
        id: IDL.Text,
        question: IDL.Text,
        options: IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
        tags: IDL.Vec(IDL.Text),
        totalVotes: IDL.Nat32,
        created_at: IDL.Text,
        updated_at: IDL.Text,
      }),
    ),
  )
  deletePoll(pollId: string): [] | [Poll] {
    const deleted = this.polls.remove(pollId);
    if (!deleted) return [];

    this.votes
      .values()
      .filter((vote) => vote.pollId === pollId)
      .forEach((vote) => this.votes.remove(vote.id));

    return [deleted];
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
    totalVotes: IDL.Nat32,
    created_at: IDL.Text,
    updated_at: IDL.Text,
  });

  const VoteRecord = IDL.Record({
    id: IDL.Text,
    pollId: IDL.Text,
    optionId: IDL.Text,
    voterId: IDL.Text,
    votedAt: IDL.Text,
  });

  return IDL.Service({
    createPoll: IDL.Func([IDL.Text, IDL.Vec(PollOption), IDL.Vec(IDL.Text)], [Poll], ['update']),
    getPoll: IDL.Func([IDL.Text], [IDL.Opt(Poll)], ['query']),
    getAllPolls: IDL.Func([], [IDL.Vec(Poll)], ['query']),
    getPollsByTag: IDL.Func([IDL.Text], [IDL.Vec(Poll)], ['query']),
    castVote: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Opt(Poll)], ['update']),
    getVotesForPoll: IDL.Func([IDL.Text], [IDL.Vec(VoteRecord)], ['query']),
    hasVoted: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], ['query']),
    getPollOptions: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(PollOption))], ['query']),
    getVoteCountForOption: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(IDL.Nat32)], ['query']),
    deletePoll: IDL.Func([IDL.Text], [IDL.Opt(Poll)], ['update']),
  });
};
