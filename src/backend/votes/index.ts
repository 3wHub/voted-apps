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
  created_by: string;
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
  private agentPolls = new StableBTreeMap<string, Set<string>>(3);

  @update(
    [
      IDL.Text,
      IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
      IDL.Vec(IDL.Text),
      IDL.Text,
    ],
    IDL.Record({
      id: IDL.Text,
      question: IDL.Text,
      options: IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
      tags: IDL.Vec(IDL.Text),
      totalVotes: IDL.Nat32,
      created_at: IDL.Text,
      updated_at: IDL.Text,
      created_by: IDL.Text,
    }),
  )
  createPoll(question: string, options: PollOption[], tags: string[], agentId: string): Poll {
    try {
      if (!question.trim()) {
        throw new Error("Question cannot be empty");
      }

      if (options.length < 2) {
        throw new Error("At least two options are required");
      }

      const now = new Date().toISOString();
      const pollId = uuidv4();

      const processedOptions = options.map(opt => ({
        id: opt.id || uuidv4(),
        label: opt.label,
        votes: 0
      }));

      const poll: Poll = {
        id: pollId,
        question: question.trim(),
        options: processedOptions,
        tags: tags || [],
        totalVotes: 0,
        created_at: now,
        updated_at: now,
        created_by: agentId,
      };

      this.polls.insert(poll.id, poll);

      let agentPollSet = this.agentPolls.get(agentId);
      if (!agentPollSet) {
        agentPollSet = new Set();
      }
      agentPollSet.add(poll.id);
      this.agentPolls.insert(agentId, agentPollSet);

      return poll;
    } catch (error) {
      throw error;
    }
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
        created_by: IDL.Text,
      }),
    ),
  )
  getPollsByAgent(agentId: string): Poll[] {
    const agentPollSet = this.agentPolls.get(agentId);
    if (!agentPollSet) return [];
    const pollIds = Array.from(agentPollSet);
    const polls: Poll[] = [];
    for (const pollId of pollIds) {
      const pollOpt = this.polls.get(pollId);
      if (pollOpt) {
        polls.push(pollOpt);
      }
    }

    return polls;
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
        created_by: IDL.Text,
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
  castVote(pollId: string, optionId: string, voterId: string): [Poll] | [] {
    const poll = this.polls.get(pollId);
    if (!poll) return [];

    if (poll.created_by === voterId) {
      throw new Error("Poll creators cannot vote on their own polls");
    }

    const voterPolls = this.voterRecords.get(voterId) ?? new Set();
    if (voterPolls.has(pollId)) {
      throw new Error('You have already voted in this poll');
    }

    const optionIndex = poll.options.findIndex((opt) => opt.id === optionId);
    if (optionIndex === -1) return [];

    const updatedOptions = [...poll.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      votes: updatedOptions[optionIndex].votes + 1,
    };

    const updatedPoll: Poll = {
      ...poll,
      options: updatedOptions,
      totalVotes: poll.totalVotes + 1,
      updated_at: new Date().toISOString(),
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
  getPollOptions(pollId: string): PollOption[] | null {
    const poll = this.polls.get(pollId);
    return poll ? poll.options : null;
  }


  @query([IDL.Text, IDL.Text], IDL.Opt(IDL.Nat32))
  getVoteCountForOption(pollId: string, optionId: string): number | null {
    const poll = this.polls.get(pollId);
    const option = poll?.options.find((opt) => opt.id === optionId);
    return option?.votes ?? null;
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
    createPoll: IDL.Func([IDL.Text, IDL.Vec(PollOption), IDL.Vec(IDL.Text)], [Poll], ['update']),
    getPollsByAgent: IDL.Func([IDL.Text], [IDL.Vec(Poll)], ['query']),
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
