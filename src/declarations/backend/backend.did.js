export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'castVote' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'updated_at' : IDL.Text,
              'question' : IDL.Text,
              'tags' : IDL.Vec(IDL.Text),
              'description' : IDL.Text,
              'end_date' : IDL.Text,
              'created_at' : IDL.Text,
              'created_by' : IDL.Text,
              'start_date' : IDL.Text,
              'total_votes' : IDL.Nat32,
              'options' : IDL.Vec(
                IDL.Record({
                  'id' : IDL.Text,
                  'votes' : IDL.Nat32,
                  'label' : IDL.Text,
                })
              ),
            })
          ),
        ],
        [],
      ),
    'cleanupAgentData' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'countMyPolls' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat32)], ['query']),
    'createPoll' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'votes' : IDL.Nat32,
              'label' : IDL.Text,
            })
          ),
          IDL.Vec(IDL.Text),
          IDL.Text,
          IDL.Text,
          IDL.Text,
        ],
        [
          IDL.Record({
            'id' : IDL.Text,
            'updated_at' : IDL.Text,
            'question' : IDL.Text,
            'tags' : IDL.Vec(IDL.Text),
            'description' : IDL.Text,
            'end_date' : IDL.Text,
            'created_at' : IDL.Text,
            'created_by' : IDL.Text,
            'start_date' : IDL.Text,
            'total_votes' : IDL.Nat32,
            'options' : IDL.Vec(
              IDL.Record({
                'id' : IDL.Text,
                'votes' : IDL.Nat32,
                'label' : IDL.Text,
              })
            ),
          }),
        ],
        [],
      ),
    'getAgentPlanInfo' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'voteCount' : IDL.Nat32,
            'plan' : IDL.Text,
            'upgradedAt' : IDL.Opt(IDL.Text),
            'lastVoteReset' : IDL.Text,
            'voterCount' : IDL.Nat32,
          }),
        ],
        ['query'],
      ),
    'getAllPolls' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'updated_at' : IDL.Text,
              'question' : IDL.Text,
              'tags' : IDL.Vec(IDL.Text),
              'description' : IDL.Text,
              'end_date' : IDL.Text,
              'created_at' : IDL.Text,
              'created_by' : IDL.Text,
              'start_date' : IDL.Text,
              'total_votes' : IDL.Nat32,
              'options' : IDL.Vec(
                IDL.Record({
                  'id' : IDL.Text,
                  'votes' : IDL.Nat32,
                  'label' : IDL.Text,
                })
              ),
            })
          ),
        ],
        ['query'],
      ),
    'getMyPolls' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'updated_at' : IDL.Text,
              'question' : IDL.Text,
              'tags' : IDL.Vec(IDL.Text),
              'description' : IDL.Text,
              'end_date' : IDL.Text,
              'created_at' : IDL.Text,
              'created_by' : IDL.Text,
              'start_date' : IDL.Text,
              'total_votes' : IDL.Nat32,
              'options' : IDL.Vec(
                IDL.Record({
                  'id' : IDL.Text,
                  'votes' : IDL.Nat32,
                  'label' : IDL.Text,
                })
              ),
            })
          ),
        ],
        ['query'],
      ),
    'getPaymentHistory' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'status' : IDL.Text,
              'completedAt' : IDL.Opt(IDL.Text),
              'createdAt' : IDL.Text,
              'agentId' : IDL.Text,
              'amount' : IDL.Nat64,
              'planType' : IDL.Text,
              'transactionId' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'getPlanUsage' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'currentPolls' : IDL.Nat32,
            'currentVoters' : IDL.Nat32,
            'maxOptions' : IDL.Nat32,
            'maxPolls' : IDL.Nat32,
            'maxVoters' : IDL.Nat32,
            'maxTags' : IDL.Nat32,
            'maxVotesPerMonth' : IDL.Nat32,
            'currentVotesThisMonth' : IDL.Nat32,
          }),
        ],
        ['query'],
      ),
    'getPoll' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'updated_at' : IDL.Text,
              'question' : IDL.Text,
              'tags' : IDL.Vec(IDL.Text),
              'description' : IDL.Text,
              'end_date' : IDL.Text,
              'created_at' : IDL.Text,
              'created_by' : IDL.Text,
              'start_date' : IDL.Text,
              'total_votes' : IDL.Nat32,
              'options' : IDL.Vec(
                IDL.Record({
                  'id' : IDL.Text,
                  'votes' : IDL.Nat32,
                  'label' : IDL.Text,
                })
              ),
            })
          ),
        ],
        ['query'],
      ),
    'getPollOptions' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Vec(
              IDL.Record({
                'id' : IDL.Text,
                'votes' : IDL.Nat32,
                'label' : IDL.Text,
              })
            )
          ),
        ],
        ['query'],
      ),
    'getPollsByAgent' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'updated_at' : IDL.Text,
              'question' : IDL.Text,
              'tags' : IDL.Vec(IDL.Text),
              'description' : IDL.Text,
              'end_date' : IDL.Text,
              'created_at' : IDL.Text,
              'created_by' : IDL.Text,
              'start_date' : IDL.Text,
              'total_votes' : IDL.Nat32,
              'options' : IDL.Vec(
                IDL.Record({
                  'id' : IDL.Text,
                  'votes' : IDL.Nat32,
                  'label' : IDL.Text,
                })
              ),
            })
          ),
        ],
        ['query'],
      ),
    'getPollsByTag' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'updated_at' : IDL.Text,
              'question' : IDL.Text,
              'tags' : IDL.Vec(IDL.Text),
              'description' : IDL.Text,
              'end_date' : IDL.Text,
              'created_at' : IDL.Text,
              'created_by' : IDL.Text,
              'start_date' : IDL.Text,
              'total_votes' : IDL.Nat32,
              'options' : IDL.Vec(
                IDL.Record({
                  'id' : IDL.Text,
                  'votes' : IDL.Nat32,
                  'label' : IDL.Text,
                })
              ),
            })
          ),
        ],
        ['query'],
      ),
    'getPremiumPlanPrice' : IDL.Func([], [IDL.Nat64], ['query']),
    'getVoteCountForOption' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Opt(IDL.Nat32)],
        ['query'],
      ),
    'getVotesForPoll' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'optionId' : IDL.Text,
              'votedAt' : IDL.Text,
              'voterId' : IDL.Text,
              'pollId' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getWalletBalance' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'balance' : IDL.Nat64,
              'lastUpdated' : IDL.Text,
              'agentId' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'hasSufficientBalance' : IDL.Func([IDL.Nat64], [IDL.Bool], ['query']),
    'hasVoted' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], ['query']),
    'login' : IDL.Func([], [IDL.Text], []),
    'logout' : IDL.Func([], [IDL.Text], []),
    'updateWalletBalance' : IDL.Func(
        [IDL.Text, IDL.Nat64],
        [
          IDL.Record({
            'balance' : IDL.Nat64,
            'lastUpdated' : IDL.Text,
            'agentId' : IDL.Text,
          }),
        ],
        [],
      ),
    'upgradeToPremium' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'voteCount' : IDL.Nat32,
            'plan' : IDL.Text,
            'upgradedAt' : IDL.Opt(IDL.Text),
            'lastVoteReset' : IDL.Text,
            'voterCount' : IDL.Nat32,
          }),
        ],
        [],
      ),
    'upgradeToPremiumWithPayment' : IDL.Func(
        [IDL.Text, IDL.Nat64],
        [
          IDL.Record({
            'voteCount' : IDL.Nat32,
            'plan' : IDL.Text,
            'upgradedAt' : IDL.Opt(IDL.Text),
            'paymentId' : IDL.Text,
            'lastVoteReset' : IDL.Text,
            'voterCount' : IDL.Nat32,
          }),
        ],
        [],
      ),
    'whoAmI' : IDL.Func([], [], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
