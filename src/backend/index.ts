import { IDL, StableBTreeMap, update, query } from 'azle';
import { v4 as uuidv4 } from 'uuid';

const Note = IDL.Record({
  id: IDL.Text,
  title: IDL.Text,
  content: IDL.Text,
  createdAt: IDL.Text,
  updatedAt: IDL.Text,
});

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default class {
  notes = new StableBTreeMap<string, Note>(0);

  @update([IDL.Text, IDL.Text], Note)
  createNote(title: string, content: string): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: uuidv4(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.insert(note.id, note);
    return note;
  }

  @query([IDL.Text], IDL.Opt(Note))
  getNote(id: string): [Note] | [] {
    const note = this.notes.get(id);
    return note != null ? [note] : [];
  }

  @query([], IDL.Vec(Note))
  getNotes(): Note[] {
    return this.notes.values();
  }

  @update([IDL.Text, IDL.Text, IDL.Text], IDL.Opt(Note))
  updateNote(id: string, title: string, content: string): [Note] | [] {
    const existing = this.notes.get(id);
    if (!existing) return [];

    const updated: Note = {
      ...existing,
      title,
      content,
      updatedAt: new Date().toISOString(),
    };

    this.notes.insert(id, updated);
    return [updated];
  }

  @update([IDL.Text], IDL.Opt(Note))
  deleteNote(id: string): [Note] | [] {
    const deleted = this.notes.remove(id);
    return deleted != null ? [deleted] : [];
  }
}
