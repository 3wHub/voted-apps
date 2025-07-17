// src/lib/api/api.ts
import { createActor, canisterId } from '../../../../declarations/backend';

// Create the actor instance once (reuse this across all API calls)
const backend = createActor(canisterId);

export const createNote = async (title: string, content: string) => {
  return await backend.createNote(title, content);
};

export const getNotes = async () => {
  return await backend.getNotes();
};

export const getNote = async (id: string) => {
  return await backend.getNote(id);
};

export const updateNote = async (id: string, title: string, content: string) => {
  return await backend.updateNote(id, title, content);
};

export const deleteNote = async (id: string) => {
  return await backend.deleteNote(id);
};
