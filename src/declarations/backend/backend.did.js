export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'createNote' : IDL.Func(
        [IDL.Text, IDL.Text],
        [
          IDL.Record({
            'id' : IDL.Text,
            'title' : IDL.Text,
            'content' : IDL.Text,
            'createdAt' : IDL.Text,
            'updatedAt' : IDL.Text,
          }),
        ],
        [],
      ),
    'deleteNote' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'createdAt' : IDL.Text,
              'updatedAt' : IDL.Text,
            })
          ),
        ],
        [],
      ),
    'getNote' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'createdAt' : IDL.Text,
              'updatedAt' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getNotes' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'createdAt' : IDL.Text,
              'updatedAt' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'updateNote' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'createdAt' : IDL.Text,
              'updatedAt' : IDL.Text,
            })
          ),
        ],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
