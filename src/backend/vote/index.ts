import { IDL, StableBTreeMap, update, query } from 'azle';
import { v4 as uuidv4 } from 'uuid';
import { authInstance } from '../auth';
import { PollOption, Poll, VoteRecord } from '../types';

export class Votes {
  private polls = new StableBTreeMap<string, Poll>(0);
  private votes = new StableBTreeMap<string, VoteRecord>(1);
  private voterRecords = new StableBTreeMap<string, Set<string>>(2);
  private agentPolls = new StableBTreeMap<string, Set<string>>(3);

  createPoll(
    question: string,
    description: string,
    options: PollOption[],
    tags: string[],
    start_date: string,
    end_date: string,
    agentId: string
  ): Poll {
    const now = new Date().toISOString();
    const id = uuidv4();


    const poll: Poll = {
      id,
      question,
      description,
      options: options.map(opt => ({
        ...opt,
        votes: 0
      })),
      tags,
      total_votes: 0,
      start_date,
      end_date,
      created_at: now,
      updated_at: now,
      created_by: agentId
    };

    this.polls.insert(id, poll);

    const agentPolls = this.agentPolls.get(agentId) ?? new Set<string>();
    agentPolls.add(id);
    this.agentPolls.insert(agentId, agentPolls);

    return poll;
  }

  getMyPolls(agentId: string): Poll[] {
    const agentPollIds = this.agentPolls.get(agentId);
    if (!agentPollIds) return [];

    return Array.from(agentPollIds)
      .map(pollId => this.polls.get(pollId))
      .filter((poll): poll is Poll => poll !== undefined);
  }

  getPoll(id: string): [] | [Poll] {
    const poll = this.polls.get(id);
    return poll ? [poll] : [];
  }

  getAllPolls(): Poll[] {
    return this.polls.values();
  }

  getPollsByTag(tag: string): Poll[] {
    return this.polls.values().filter(poll => poll.tags.includes(tag));
  }

  getPollsByAgent(agentId: string): Poll[] {
    return this.polls.values().filter(poll => poll.created_by === agentId);
  }

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

  getVotesForPoll(pollId: string): VoteRecord[] {
    return this.votes.values().filter(vote => vote.pollId === pollId);
  }

  hasVoted(pollId: string): boolean {
    const voterId = authInstance.getCurrentUser().toString();
    const voterPolls = this.voterRecords.get(voterId);
    return voterPolls ? voterPolls.has(pollId) : false;
  }

  getPollOptions(pollId: string): [] | [PollOption[]] {
    const poll = this.polls.get(pollId);
    return poll ? [poll.options] : [];
  }

  getVoteCountForOption(pollId: string, optionId: string): [] | [number] {
    const poll = this.polls.get(pollId);
    if (!poll) return [];

    const option = poll.options.find(opt => opt.id === optionId);
    return option ? [option.votes] : [];
  }
}

export const votesInstance = new Votes();