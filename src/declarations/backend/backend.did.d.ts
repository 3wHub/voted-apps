import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'castVote' : ActorMethod<[string, string], undefined>,
  'createPoll' : ActorMethod<
    [
      string,
      Array<{ 'id' : string, 'votes' : number, 'label' : string }>,
      Array<string>,
    ],
    undefined
  >,
  'getAllPolls' : ActorMethod<[], undefined>,
  'getMyPolls' : ActorMethod<[], undefined>,
  'getPoll' : ActorMethod<[string], undefined>,
  'getPollOptions' : ActorMethod<[string], undefined>,
  'getPollsByAgent' : ActorMethod<[], undefined>,
  'getPollsByTag' : ActorMethod<[string], undefined>,
  'getVoteCountForOption' : ActorMethod<[string, string], undefined>,
  'getVotesForPoll' : ActorMethod<[string], undefined>,
  'hasVoted' : ActorMethod<[string], undefined>,
  'login' : ActorMethod<[], undefined>,
  'logout' : ActorMethod<[], undefined>,
  'whoAmI' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
