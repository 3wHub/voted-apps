import { IDL } from "azle";

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

export const PollsIdl = IDL.Record({
    id: IDL.Text,
    question: IDL.Text,
    description: IDL.Text,
    tags: IDL.Vec(IDL.Text),
    start_date: IDL.Text,
    end_date: IDL.Text,
    created_by: IDL.Text,
    created_at: IDL.Text,
    updated_at: IDL.Text,
    total_votes: IDL.Nat32,
    options: IDL.Vec(IDL.Record({
      id: IDL.Text,
      label: IDL.Text,
      votes: IDL.Nat32
    }))
  });