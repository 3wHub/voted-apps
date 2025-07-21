import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'castVote' : ActorMethod<
    [string, string, string],
    [] | [
      {
        'id' : string,
        'updated_at' : string,
        'question' : string,
        'totalVotes' : number,
        'tags' : Array<string>,
        'created_at' : string,
        'options' : Array<
          { 'id' : string, 'votes' : number, 'label' : string }
        >,
      }
    ]
  >,
  'createPoll' : ActorMethod<
    [
      string,
      Array<{ 'id' : string, 'votes' : number, 'label' : string }>,
      Array<string>,
      string,
    ],
    {
      'id' : string,
      'updated_at' : string,
      'question' : string,
      'totalVotes' : number,
      'tags' : Array<string>,
      'created_at' : string,
      'created_by' : string,
      'options' : Array<{ 'id' : string, 'votes' : number, 'label' : string }>,
    }
  >,
  'deletePoll' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'updated_at' : string,
        'question' : string,
        'totalVotes' : number,
        'tags' : Array<string>,
        'created_at' : string,
        'options' : Array<
          { 'id' : string, 'votes' : number, 'label' : string }
        >,
      }
    ]
  >,
  'getAllPolls' : ActorMethod<
    [],
    Array<
      {
        'id' : string,
        'updated_at' : string,
        'question' : string,
        'totalVotes' : number,
        'tags' : Array<string>,
        'created_at' : string,
        'options' : Array<
          { 'id' : string, 'votes' : number, 'label' : string }
        >,
      }
    >
  >,
  'getPoll' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'updated_at' : string,
        'question' : string,
        'totalVotes' : number,
        'tags' : Array<string>,
        'created_at' : string,
        'created_by' : string,
        'options' : Array<
          { 'id' : string, 'votes' : number, 'label' : string }
        >,
      }
    ]
  >,
  'getPollOptions' : ActorMethod<
    [string],
    [] | [Array<{ 'id' : string, 'votes' : number, 'label' : string }>]
  >,
  'getPollsByAgent' : ActorMethod<
    [string],
    Array<
      {
        'id' : string,
        'updated_at' : string,
        'question' : string,
        'totalVotes' : number,
        'tags' : Array<string>,
        'created_at' : string,
        'created_by' : string,
        'options' : Array<
          { 'id' : string, 'votes' : number, 'label' : string }
        >,
      }
    >
  >,
  'getPollsByTag' : ActorMethod<
    [string],
    Array<
      {
        'id' : string,
        'updated_at' : string,
        'question' : string,
        'totalVotes' : number,
        'tags' : Array<string>,
        'created_at' : string,
        'options' : Array<
          { 'id' : string, 'votes' : number, 'label' : string }
        >,
      }
    >
  >,
  'getVoteCountForOption' : ActorMethod<[string, string], [] | [number]>,
  'getVotesForPoll' : ActorMethod<
    [string],
    Array<
      {
        'id' : string,
        'optionId' : string,
        'votedAt' : string,
        'voterId' : string,
        'pollId' : string,
      }
    >
  >,
  'hasVoted' : ActorMethod<[string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
