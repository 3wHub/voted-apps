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
        'tags' : Array<string>,
        'description' : string,
        'end_date' : string,
        'created_at' : string,
        'created_by' : string,
        'start_date' : string,
        'total_votes' : number,
        'options' : Array<
          { 'id' : string, 'votes' : number, 'label' : string }
        >,
      }
    ]
  >,
  'countMyPolls' : ActorMethod<[string], [] | [number]>,
  'createPoll' : ActorMethod<
    [
      string,
      string,
      Array<{ 'id' : string, 'votes' : number, 'label' : string }>,
      Array<string>,
      string,
      string,
      string,
    ],
    {
      'id' : string,
      'updated_at' : string,
      'question' : string,
      'tags' : Array<string>,
      'description' : string,
      'end_date' : string,
      'created_at' : string,
      'created_by' : string,
      'start_date' : string,
      'total_votes' : number,
      'options' : Array<{ 'id' : string, 'votes' : number, 'label' : string }>,
    }
  >,
  'getAgentPlanInfo' : ActorMethod<
    [string],
    {
      'voteCount' : number,
      'plan' : string,
      'upgradedAt' : [] | [string],
      'lastVoteReset' : string,
      'voterCount' : number,
    }
  >,
  'getAllPolls' : ActorMethod<
    [],
    Array<
      {
        'id' : string,
        'updated_at' : string,
        'question' : string,
        'tags' : Array<string>,
        'description' : string,
        'end_date' : string,
        'created_at' : string,
        'created_by' : string,
        'start_date' : string,
        'total_votes' : number,
        'options' : Array<
          { 'id' : string, 'votes' : number, 'label' : string }
        >,
      }
    >
  >,
  'getMyPolls' : ActorMethod<
    [string],
    Array<
      {
        'id' : string,
        'updated_at' : string,
        'question' : string,
        'tags' : Array<string>,
        'description' : string,
        'end_date' : string,
        'created_at' : string,
        'created_by' : string,
        'start_date' : string,
        'total_votes' : number,
        'options' : Array<
          { 'id' : string, 'votes' : number, 'label' : string }
        >,
      }
    >
  >,
  'getPlanUsage' : ActorMethod<
    [string],
    {
      'currentPolls' : number,
      'currentVoters' : number,
      'maxOptions' : number,
      'maxPolls' : number,
      'maxVoters' : number,
      'maxTags' : number,
      'maxVotesPerMonth' : number,
      'currentVotesThisMonth' : number,
    }
  >,
  'getPoll' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'updated_at' : string,
        'question' : string,
        'tags' : Array<string>,
        'description' : string,
        'end_date' : string,
        'created_at' : string,
        'created_by' : string,
        'start_date' : string,
        'total_votes' : number,
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
        'tags' : Array<string>,
        'description' : string,
        'end_date' : string,
        'created_at' : string,
        'created_by' : string,
        'start_date' : string,
        'total_votes' : number,
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
        'tags' : Array<string>,
        'description' : string,
        'end_date' : string,
        'created_at' : string,
        'created_by' : string,
        'start_date' : string,
        'total_votes' : number,
        'options' : Array<
          { 'id' : string, 'votes' : number, 'label' : string }
        >,
      }
    >
  >,
  'getVoteCountForOption' : ActorMethod<[string, string], [] | [number]>,
  'getVotedPolls' : ActorMethod<
    [string],
    Array<
      {
        'id' : string,
        'updated_at' : string,
        'question' : string,
        'tags' : Array<string>,
        'description' : string,
        'end_date' : string,
        'created_at' : string,
        'created_by' : string,
        'start_date' : string,
        'total_votes' : number,
        'options' : Array<
          { 'id' : string, 'votes' : number, 'label' : string }
        >,
      }
    >
  >,
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
  'login' : ActorMethod<[], string>,
  'logout' : ActorMethod<[], string>,
  'upgradeToPremium' : ActorMethod<
    [string],
    {
      'voteCount' : number,
      'plan' : string,
      'upgradedAt' : [] | [string],
      'lastVoteReset' : string,
      'voterCount' : number,
    }
  >,
  'whoAmI' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
