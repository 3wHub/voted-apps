export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'castVote' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'createPoll' : IDL.Func(
        [
          IDL.Text,
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'votes' : IDL.Nat32,
              'label' : IDL.Text,
            })
          ),
          IDL.Vec(IDL.Text),
        ],
        [],
        [],
      ),
    'getAllPolls' : IDL.Func([], [], ['query']),
    'getMyPolls' : IDL.Func([], [], ['query']),
    'getPoll' : IDL.Func([IDL.Text], [], ['query']),
    'getPollOptions' : IDL.Func([IDL.Text], [], ['query']),
    'getPollsByAgent' : IDL.Func([], [], ['query']),
    'getPollsByTag' : IDL.Func([IDL.Text], [], ['query']),
    'getVoteCountForOption' : IDL.Func([IDL.Text, IDL.Text], [], ['query']),
    'getVotesForPoll' : IDL.Func([IDL.Text], [], ['query']),
    'hasVoted' : IDL.Func([IDL.Text], [], ['query']),
    'login' : IDL.Func([], [], []),
    'logout' : IDL.Func([], [], []),
    'whoAmI' : IDL.Func([], [], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
