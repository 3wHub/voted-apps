import { IDL } from 'azle';

export const PollOptionIdl = IDL.Record({
    id: IDL.Text,
    label: IDL.Text,
    votes: IDL.Nat32,
});

export const PollsIdl = IDL.Record({
    id: IDL.Text,
    question: IDL.Text,
    description: IDL.Text,
    options: IDL.Vec(PollOptionIdl),
    tags: IDL.Vec(IDL.Text),
    total_votes: IDL.Nat32,
    start_date: IDL.Text,
    end_date: IDL.Text,
    created_at: IDL.Text,
    updated_at: IDL.Text,
    created_by: IDL.Text,
});

export const VoteRecordIdl = IDL.Record({
    id: IDL.Text,
    pollId: IDL.Text,
    optionId: IDL.Text,
    voterId: IDL.Text,
    votedAt: IDL.Text,
});

export type IDLType = typeof IDL;