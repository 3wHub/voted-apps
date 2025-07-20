export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    login: IDL.Func([], [], []),
    logout: IDL.Func([], [], []),
    whoAmI: IDL.Func([], [], ['query']),
  });
};
export const init = ({ IDL }) => {
  return [];
};
