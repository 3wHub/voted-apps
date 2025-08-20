import { IDL, StableBTreeMap, update, query } from 'azle';
import { v4 as uuidv4 } from 'uuid';
import { PollOption, Poll, VoteRecord } from '../types';
import { plan } from '../plan';

export class Votes {
    private polls = new StableBTreeMap<string, Poll>(0);
    private votes = new StableBTreeMap<string, VoteRecord>(1);
    private voterRecords = new StableBTreeMap<string, string[]>(2);
    private agentPolls = new StableBTreeMap<string, string[]>(4);

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
        }),
    )
    createPoll(
        question: string,
        description: string,
        options: PollOption[],
        tags: string[],
        start_date: string,
        end_date: string,
        agentId: string,
    ): Poll {
        try {

            if (!question || question.length > 200) {
                throw new Error("Question is required and must be <= 200 characters");
            }

            if (description.length > 500) {
                throw new Error("Description must be <= 500 characters");
            }

            if (options.length < 2 || options.length > 100) {
                throw new Error("Must have between 2 and 100 options");
            }

            for (const opt of options) {
                if (!opt.id || !opt.label || opt.label.length > 100) {
                    throw new Error("Each option must have id and label <= 100 characters");
                }
            }

            if (tags.length > 50) {
                throw new Error("Maximum of 50 tags allowed");
            }

            for (const tag of tags) {
                if (tag.length > 50) {
                    throw new Error("Each tag must be <= 50 characters");
                }
            }

            const now = new Date().toISOString();
            const id = uuidv4();

            const poll: Poll = {
                id,
                question,
                description,
                options,
                tags,
                total_votes: 0,
                start_date,
                end_date,
                created_at: now,
                updated_at: now,
                created_by: agentId
            };

            // Check limits before creating the poll
            plan.validateCreatePollLimits(agentId, options, tags);

            // Insert the poll
            this.polls.insert(id, poll);

            // Update agent's poll list
            const existingPollIds = this.agentPolls.get(agentId) ?? [];

            if (!existingPollIds.includes(id)) {
                existingPollIds.push(id);
                this.agentPolls.insert(agentId, existingPollIds);
            }

            // Track the creation
            plan.trackPollCreation(agentId, id);

            return poll;
        } catch (error) {
            console.error('Backend poll creation failed:', error);
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
        const agentPollSet = this.agentPolls.get(agentId);
        if (!agentPollSet) return [];

        return Array.from(agentPollSet)
            .map((pollId) => this.polls.get(pollId))
            .filter((poll) => poll !== undefined) as Poll[];
    }

    @query([IDL.Text], IDL.Opt(IDL.Nat32))
    countMyPolls(agentId: string): [] | [number] {
        try {
            const agentPollSet = this.agentPolls.get(agentId);
            if (!agentPollSet || !Array.isArray(agentPollSet)) {
                return [0];
            }

            const count = agentPollSet.length;
            if (typeof count !== 'number' || isNaN(count) || count < 0) {
                return [0];
            }

            return [count];
        } catch (error) {
            console.error('Error in countMyPolls:', error);
            return [0];
        }
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
        return this.polls.values().filter((poll) => poll.tags.includes(tag));
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
        const agentPollSet = this.agentPolls.get(agentId);
        if (!agentPollSet) return [];
        const allPolls = Array.from(this.polls.values());
        return allPolls.filter((poll) => poll.created_by === agentId);
    }

    @update(
        [IDL.Text, IDL.Text, IDL.Text],
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
    castVote(agentId: string, pollId: string, optionId: string): [Poll] | [] {
        let voterId = agentId;
        const poll = this.polls.get(pollId);
        if (!poll) return [];

        if (poll.created_by === voterId) {
            throw new Error('Poll creators cannot vote on their own polls');
        }

        const voterPolls = this.voterRecords.get(voterId) ?? [];
        if (voterPolls.includes(pollId)) {
            throw new Error('You have already voted in this poll');
        }

        plan.trackVote(poll.created_by, agentId);

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

        voterPolls.push(pollId);
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
    hasVoted(agentId: string, pollId: string): boolean {
        const voterPolls = this.voterRecords.get(agentId);
        return voterPolls ? voterPolls.includes(pollId) : false;
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
        const option = poll?.options.find((opt) => opt.id === optionId);
        return option ? [option.votes] : [];
    }

    @update([IDL.Text], IDL.Bool)
    cleanupAgentData(agentId: string): boolean {
        try {
            // Reset the agent's poll data to an empty array
            this.agentPolls.insert(agentId, []);
            return true;
        } catch (error) {
            console.error('Error cleaning up agent data:', error);
            return false;
        }
    }
}
export const votesInstance = new Votes();
