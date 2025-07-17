// src/App.tsx

import { useEffect, useState } from 'react';
import { createNote, deleteNote, getNotes } from './lib/api/api';

function App() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      await createNote(title, content);
      setTitle('');
      setContent('');
      loadNotes();
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      loadNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notes App</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border p-2 w-full mb-2"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        className="border p-2 w-full mb-2"
      />

      <button
        onClick={handleCreate}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Note
      </button>

      <ul className="mt-4">
        {notes?.length > 0 ? (
          notes.map((note) => (
            <li key={note.id} className="border p-2 my-2 rounded shadow-sm">
              <strong className="block text-lg">{note.title}</strong>
              <p className="text-gray-700">{note.content}</p>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-red-500 mt-2 hover:underline"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No notes yet.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
