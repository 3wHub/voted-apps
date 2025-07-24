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
    'hasVoted' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], ['query']),
    'login' : IDL.Func([], [IDL.Text], []),
    'logout' : IDL.Func([], [IDL.Text], []),
    'whoAmI' : IDL.Func([], [], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
