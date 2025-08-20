import { createActor, canisterId } from '../../../declarations/backend';
import { whoAmI } from './auth';
import { createRobustActor, retryActorCall } from './actor';
import { Vote, VoteType } from '../types/voteTypes';

const backend = createActor(canisterId);

export type PollOption = {
    id: string;
    label: string;
    votes: number;
};

export type Poll = {
    id: string;
    question: string;
    description: string;
    type?: VoteType;
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

type BackendResponse<T> = [] | [T];
type BackendOptionalResponse<T> = BackendResponse<T> | undefined | null;


export const createPoll = async (pollData: {
    title: string;
    description: string;
    location?: string;
    type: VoteType;
    options: PollOption[];
    tags: string[];
    startDate: string;
    endDate: string;
}): Promise<Vote> => {
    try {
        const agentId = (await whoAmI()).toString();

        if (!agentId) throw new Error('Authentication required');

        // Ensure all required parameters are present and correctly formatted
        const formattedOptions = pollData.options.map(opt => ({
            id: opt.id || `opt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            label: opt.label,
            votes: 0
        }));

        const result = await backend.createPoll(
            pollData.title,
            pollData.description || '',
            formattedOptions,
            pollData.tags || [],
            pollData.startDate,
            pollData.endDate,
            agentId
        );

        if (!result.id) throw new Error('Invalid response');

        return {
            id: result.id,
            title: result.question,
            description: result.description,
            type: pollData.type,
            options: result.options,
            tags: result.tags,
            startDate: result.start_date,
            endDate: result.end_date,
            createdAt: result.created_at,
            creator: result.created_by,
            status: 'active'
        };
    } catch (error) {
        throw error;
    }
};

export const getPoll = async (id: string): Promise<Poll | null> => {
    try {
        const result = await backend.getPoll(id);
        return result?.[0] ?? null;
    } catch (error) {
        console.error(`Failed to fetch poll ${id}:`, error);
        return null;
    }
};

export const getMyPolls = async (): Promise<Poll[]> => {
    try {
        const agentId = (await whoAmI()).toString();
        if (!agentId) return [];
        return (await backend.getMyPolls(agentId)) ?? [];
    } catch (error) {
        console.error('Failed to fetch user polls:', error);
        return [];
    }
};

export const countMyPolls = async (): Promise<Poll[]> => {
    try {
        const agentId = (await whoAmI()).toString();
        if (!agentId) return [];
        return (await backend.getMyPolls(agentId)) ?? [];
    } catch (error) {
        console.error('Failed to fetch user polls:', error);
        return [];
    }
};

export const getAllPolls = async (): Promise<Poll[]> => {
    try {
        return (await backend.getAllPolls()) ?? [];
    } catch (error) {
        console.error('Failed to fetch all polls:', error);
        return [];
    }
};

const convertPollToVote = (poll: Poll): Vote => {
    return {
        id: poll.id,
        title: poll.question,
        description: poll.description,
        type: poll.type || VoteType.BASIC,
        options: poll.options,
        tags: poll.tags,
        startDate: poll.start_date,
        endDate: poll.end_date,
        createdAt: poll.created_at,
        creator: poll.created_by,
        status: 'active'
    };
};

export const getPollsByAgent = async (): Promise<Vote[]> => {
    try {
        const agentId = (await whoAmI()).toString();
        const result = await backend.getMyPolls(agentId) as Poll[];
        return result.map(convertPollToVote);
    } catch (error) {
        return [];
    }
};

export const countPollsByAgent = async (): Promise<number> => {
    try {
        const agentId = (await whoAmI()).toString();
        if (!agentId) return 0;

        return await retryActorCall(async () => {
            const robustBackend = await createRobustActor();
            const response = await robustBackend.countMyPolls(agentId);
            const result = response as BackendOptionalResponse<number>;

            if (!result) return 0;
            if (Array.isArray(result) && result.length === 0) return 0;
            if (Array.isArray(result) && result.length > 0) {
                const count = result[0];
                return typeof count === 'number' ? count : 0;
            }

            return 0;
        });
    } catch (error) {
        console.error('Error fetching poll count:', error);
        return 0;
    }
}

export const castVote = async (pollId: string, optionId: string): Promise<Poll | null> => {
    try {
        const agentId = (await whoAmI()).toString();
        const result = await backend.castVote(agentId, pollId, optionId);
        return result?.[0] ?? null;
    } catch (error) {
        console.error(`Failed to cast vote for poll ${pollId}:`, error);
        return null;
    }
};

export const getVotesForPoll = async (pollId: string): Promise<VoteRecord[]> => {
    return await backend.getVotesForPoll(pollId) as VoteRecord[];
};

export const hasVoted = async (pollId: string): Promise<boolean> => {
    const agentId = (await whoAmI()).toString();
    return await backend.hasVoted(agentId, pollId) as boolean;
};

export const getPollOptions = async (pollId: string): Promise<PollOption[]> => {
    try {
        const response = await backend.getPollOptions(pollId);
        const result = response as BackendOptionalResponse<PollOption[]>;

        if (!result) return [];
        if (result.length === 0) return [];

        const options = result[0];
        return Array.isArray(options) ? options : [];
    } catch (error) {
        return [];
    }
};

export const getVoteCountForOption = async (
    pollId: string,
    optionId: string
): Promise<number> => {
    try {
        const response = await backend.getVoteCountForOption(pollId, optionId);
        const result = response as BackendOptionalResponse<number>;

        if (!result) return 0;
        if (result.length === 0) return 0;

        const count = result[0];
        return typeof count === 'number' ? count : 0;
    } catch (error) {
        console.error('Error fetching vote count:', error);
        return 0;
    }
};
