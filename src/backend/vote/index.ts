import { IDL, StableBTreeMap, update, query } from 'azle';
import { v4 as uuidv4 } from 'uuid';
import { authInstance } from '../auth';
import { PollOption, Poll, VoteRecord } from '../types';
import { PollsIdl } from '../types/idl';

export class Votes {
  private polls = new StableBTreeMap<string, Poll>(0);
  private votes = new StableBTreeMap<string, VoteRecord>(1);
  private voterRecords = new StableBTreeMap<string, Set<string>>(2);
  private agentPolls = new StableBTreeMap<string, Set<string>>(3);

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
    try {
      if (!question || !description || !options || !tags || !start_date || !end_date || !agentId) {
        throw new Error("All fields are required");
      }

      if (!Array.isArray(options) || options.length === 0) {
        throw new Error("Options must be a non-empty array");
      }

      const validatedOptions = options.map(opt => ({
        id: opt.id || uuidv4(),
        label: opt.label || '',
        votes: opt.votes || 0
      }));

      return votesInstance.createPoll(
        question,
        description,
        validatedOptions,
        tags,
        start_date,
        end_date,
        agentId
      );
    } catch (error) {
      console.error("Error in createPoll:", error);
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
        total_votes: IDL.Nat32,
        created_at: IDL.Text,
        start_date: IDL.Text,
        end_date: IDL.Text,
        updated_at: IDL.Text,
        created_by: IDL.Text,
      }),
    ),
  )
  getMyPolls(agentId: string): Poll[] {
    const agentPollIds = this.agentPolls.get(agentId);
    if (!agentPollIds) return [];

    return Array.from(agentPollIds)
      .map(pollId => this.polls.get(pollId))
      .filter((poll): poll is Poll => poll !== undefined);
  }

  @query(
    [IDL.Text],
    IDL.Opt(
      IDL.Record({
        id: IDL.Text,
        question: IDL.Text,
        options: IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
        tags: IDL.Vec(IDL.Text),
        total_votes: IDL.Nat32,
        created_at: IDL.Text,
        start_date: IDL.Text,
        end_date: IDL.Text,
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
        total_votes: IDL.Nat32,
        created_at: IDL.Text,
        start_date: IDL.Text,
        end_date: IDL.Text,
        updated_at: IDL.Text,
        created_by: IDL.Text,
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
        total_votes: IDL.Nat32,
        created_at: IDL.Text,
        start_date: IDL.Text,
        end_date: IDL.Text,
        updated_at: IDL.Text,
      }),
    ),
  )
  getPollsByTag(tag: string): Poll[] {
    return this.polls.values().filter(poll => poll.tags.includes(tag));
  }

  @query(
    [],
    IDL.Vec(
      IDL.Record({
        id: IDL.Text,
        question: IDL.Text,
        options: IDL.Vec(
          IDL.Record({
            id: IDL.Text,
            label: IDL.Text,
            votes: IDL.Nat32,
          }),
        ),
        tags: IDL.Vec(IDL.Text),
        total_votes: IDL.Nat32,
        created_at: IDL.Text,
        start_date: IDL.Text,
        end_date: IDL.Text,
        updated_at: IDL.Text,
        created_by: IDL.Text,
      }),
    ),
  )
  getPollsByAgent(agentId: string): Poll[] {
    return this.polls.values().filter(poll => poll.created_by === agentId);
  }

  @update(
    [IDL.Text, IDL.Text],
    IDL.Opt(
      IDL.Record({
        id: IDL.Text,
        question: IDL.Text,
        options: IDL.Vec(IDL.Record({ id: IDL.Text, label: IDL.Text, votes: IDL.Nat32 })),
        tags: IDL.Vec(IDL.Text),
        total_votes: IDL.Nat32,
        created_at: IDL.Text,
        start_date: IDL.Text,
        end_date: IDL.Text,
        updated_at: IDL.Text,
      }),
    ),
  )
  castVote(pollId: string, optionId: string): [] | [Poll] {
    const voterId = authInstance.getCurrentUser().toString();
    const poll = this.polls.get(pollId);

    if (!poll) return [];
    if (poll.created_by === voterId) {
      throw new Error('Poll creators cannot vote on their own polls');
    }

    const voterPolls = this.voterRecords.get(voterId) ?? new Set();
    if (voterPolls.has(pollId)) {
      throw new Error('You have already voted in this poll');
    }

    const optionIndex = poll.options.findIndex(opt => opt.id === optionId);
    if (optionIndex === -1) return [];

    const updatedOptions = [...poll.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      votes: updatedOptions[optionIndex].votes + 1,
    };

    const updatedPoll: Poll = {
      ...poll,
      options: updatedOptions,
      total_votes: poll.total_votes + 1,
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
    return this.votes.values().filter(vote => vote.pollId === pollId);
  }

  @query([IDL.Text], IDL.Bool)
  hasVoted(pollId: string): boolean {
    const voterId = authInstance.getCurrentUser().toString();
    const voterPolls = this.voterRecords.get(voterId);
    return voterPolls ? voterPolls.has(pollId) : false;
  }

  @query(
    [IDL.Text],
    IDL.Opt(
      IDL.Vec(
        IDL.Record({
          id: IDL.Text,
          label: IDL.Text,
          votes: IDL.Nat32,
        }),
      ),
    ),
  )
  getPollOptions(pollId: string): [] | [PollOption[]] {
    const poll = this.polls.get(pollId);
    return poll ? [poll.options] : [];
  }

  @query([IDL.Text, IDL.Text], IDL.Opt(IDL.Nat32))
  getVoteCountForOption(pollId: string, optionId: string): [] | [number] {
    const poll = this.polls.get(pollId);
    if (!poll) return [];

    const option = poll.options.find(opt => opt.id === optionId);
    return option ? [option.votes] : [];
  }
}

export const votesInstance = new Votes();