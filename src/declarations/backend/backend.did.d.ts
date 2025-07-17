import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'createNote' : ActorMethod<
    [string, string],
    {
      'id' : string,
      'title' : string,
      'content' : string,
      'createdAt' : string,
      'updatedAt' : string,
    }
  >,
  'deleteNote' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'title' : string,
        'content' : string,
        'createdAt' : string,
        'updatedAt' : string,
      }
    ]
  >,
  'getNote' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'title' : string,
        'content' : string,
        'createdAt' : string,
        'updatedAt' : string,
      }
    ]
  >,
  'getNotes' : ActorMethod<
    [],
    Array<
      {
        'id' : string,
        'title' : string,
        'content' : string,
        'createdAt' : string,
        'updatedAt' : string,
      }
    >
  >,
  'updateNote' : ActorMethod<
    [string, string, string],
    [] | [
      {
        'id' : string,
        'title' : string,
        'content' : string,
        'createdAt' : string,
        'updatedAt' : string,
      }
    ]
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
