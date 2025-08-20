import { IDL, update, query } from 'azle';
import { PollOption, Poll, VoteRecord } from './types';
import { PollsIdl, PollOptionIdl, VoteRecordIdl, IDLType } from './types/idl';
import { votesInstance } from './vote';
import { authInstance } from './auth';
import { plan } from './plan';
import { coinService } from './coin';

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

    @query([IDL.Text], IDL.Vec(PollsIdl))
    getVotedPolls(agentId: string): Poll[] {
        return votesInstance.getVotedPolls(agentId);
    }

    @query([IDL.Text], IDL.Opt(IDL.Nat32))
    countMyPolls(agentId: string): [] | [number] {
        return votesInstance.countMyPolls(agentId);
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

  @update([IDL.Text], IDL.Record({
    plan: IDL.Text,
    upgradedAt: IDL.Opt(IDL.Text),
    voteCount: IDL.Nat32,
    lastVoteReset: IDL.Text,
    voterCount: IDL.Nat32
}))
  upgradeToPremium(agentId: string) {
    return plan.upgradeToPremium(agentId);
  }

  @query([IDL.Text], IDL.Record({
    plan: IDL.Text,
    upgradedAt: IDL.Opt(IDL.Text),
    voteCount: IDL.Nat32,
    lastVoteReset: IDL.Text,
    voterCount: IDL.Nat32
  }))
  getAgentPlanInfo(agentId: string) {
    return plan.getAgentPlanInfo(agentId);
  }

  @query([IDL.Text], IDL.Record({
    maxPolls: IDL.Nat32,
    maxOptions: IDL.Nat32,
    maxTags: IDL.Nat32,
    currentPolls: IDL.Nat32,
    maxVotesPerMonth: IDL.Nat32,
    currentVotesThisMonth: IDL.Nat32,
    maxVoters: IDL.Nat32,
    currentVoters: IDL.Nat32
  }))
  getPlanUsage(agentId: string) {
    return plan.getPlanUsage(agentId);
  }

  // Coin/Wallet Integration Methods
  @query([], IDL.Nat64)
  getPremiumPlanPrice() {
    return coinService.getPremiumPlanPrice();
  }

  @update([IDL.Text, IDL.Nat64], IDL.Record({
    plan: IDL.Text,
    upgradedAt: IDL.Opt(IDL.Text),
    voteCount: IDL.Nat32,
    lastVoteReset: IDL.Text,
    voterCount: IDL.Nat32,
    paymentId: IDL.Text,
  }))
  upgradeToPremiumWithPayment(agentId: string, transactionId: bigint) {
    return plan.upgradeToPremiumWithPayment(agentId, transactionId);
  }

  @query([IDL.Text], IDL.Vec(IDL.Record({
    id: IDL.Text,
    agentId: IDL.Text,
    amount: IDL.Nat64,
    transactionId: IDL.Nat64,
    planType: IDL.Text,
    status: IDL.Text,
    createdAt: IDL.Text,
    completedAt: IDL.Opt(IDL.Text)
  })))
  getPaymentHistory(agentId: string) {
    return coinService.getPaymentHistory(agentId);
  }

  @query([IDL.Text], IDL.Opt(IDL.Record({
    agentId: IDL.Text,
    balance: IDL.Nat64,
    lastUpdated: IDL.Text
  })))
  getWalletBalance(agentId: string) {
    return coinService.getWalletBalance(agentId);
  }

  @update([IDL.Text, IDL.Nat64], IDL.Record({
    agentId: IDL.Text,
    balance: IDL.Nat64,
    lastUpdated: IDL.Text
  }))
  updateWalletBalance(agentId: string, balance: bigint) {
    return coinService.updateWalletBalance(agentId, balance);
  }

  @query([IDL.Nat64], IDL.Bool)
  hasSufficientBalance(balance: bigint) {
    return coinService.hasSufficientBalance(balance);
  }

  @update([IDL.Text], IDL.Bool)
  cleanupAgentData(agentId: string) {
    return votesInstance.cleanupAgentData(agentId);
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
    getVotedPolls: IDL.Func([IDL.Text], [IDL.Vec(PollsIdl)], ['query']),
    countMyPolls: IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat32)], ['query']),
    castVote: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Opt(PollsIdl)], ['update']),
    getVotesForPoll: IDL.Func([IDL.Text], [IDL.Vec(VoteRecordIdl)], ['query']),
    getPollOptions: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(PollOptionIdl))], ['query']),
    getVoteCountForOption: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(IDL.Nat32)], ['query']),
    hasVoted: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], ['query']),

    upgradeToPremium: IDL.Func([IDL.Text], [
      IDL.Record({
        plan: IDL.Text,
        upgradedAt: IDL.Opt(IDL.Text),
        voteCount: IDL.Nat32,
        lastVoteReset: IDL.Text,
        voterCount: IDL.Nat32
      })
    ], ['update']),
    getAgentPlanInfo: IDL.Func([IDL.Text], [
      IDL.Record({
        plan: IDL.Text,
        upgradedAt: IDL.Opt(IDL.Text),
        voteCount: IDL.Nat32,
        lastVoteReset: IDL.Text,
        voterCount: IDL.Nat32
      })
    ], ['query']),
    getPlanUsage: IDL.Func([IDL.Text], [
      IDL.Record({
        maxPolls: IDL.Nat32,
        maxOptions: IDL.Nat32,
        maxTags: IDL.Nat32,
        currentPolls: IDL.Nat32,
        maxVotesPerMonth: IDL.Nat32,
        currentVotesThisMonth: IDL.Nat32,
        maxVoters: IDL.Nat32,
        currentVoters: IDL.Nat32
      })
    ], ['query']),

    // Coin/Wallet Integration Methods
    getPremiumPlanPrice: IDL.Func([], [IDL.Nat64], ['query']),
    upgradeToPremiumWithPayment: IDL.Func([IDL.Text, IDL.Nat64], [
      IDL.Record({
        plan: IDL.Text,
        upgradedAt: IDL.Opt(IDL.Text),
        voteCount: IDL.Nat32,
        lastVoteReset: IDL.Text,
        voterCount: IDL.Nat32,
        paymentId: IDL.Text,
      })
    ], ['update']),
    getPaymentHistory: IDL.Func([IDL.Text], [IDL.Vec(IDL.Record({
      id: IDL.Text,
      agentId: IDL.Text,
      amount: IDL.Nat64,
      transactionId: IDL.Nat64,
      planType: IDL.Text,
      status: IDL.Text,
      createdAt: IDL.Text,
      completedAt: IDL.Opt(IDL.Text)
    }))], ['query']),
    getWalletBalance: IDL.Func([IDL.Text], [IDL.Opt(IDL.Record({
      agentId: IDL.Text,
      balance: IDL.Nat64,
      lastUpdated: IDL.Text
    }))], ['query']),
    updateWalletBalance: IDL.Func([IDL.Text, IDL.Nat64], [IDL.Record({
      agentId: IDL.Text,
      balance: IDL.Nat64,
      lastUpdated: IDL.Text
    })], ['update']),
    hasSufficientBalance: IDL.Func([IDL.Nat64], [IDL.Bool], ['query']),
    cleanupAgentData: IDL.Func([IDL.Text], [IDL.Bool], ['update']),

  });
};
