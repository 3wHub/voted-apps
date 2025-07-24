import { IDL } from "azle";

// TypeScript Types
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

