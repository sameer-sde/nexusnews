import { useState, useEffect } from 'react';

const STORAGE_KEY = 'nexus_bookmarks';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(load);
  const add = (article, note = '') => {
    const entry = { id: Date.now(), title: article.title, source: article.source?.name, url: article.url, note, savedAt: new Date().toISOString() };
    const updated = [entry, ...bookmarks];
    setBookmarks(updated); save(updated);
  };
  const remove = (id) => { const updated = bookmarks.filter(b => b.id !== id); setBookmarks(updated); save(updated); };
  const updateNote = (id, note) => { const updated = bookmarks.map(b => b.id === id ? { ...b, note } : b); setBookmarks(updated); save(updated); };
  return { bookmarks, add, remove, updateNote };
}

export default function Bookmarks() {
  const { bookmarks, remove, updateNote } = useBookmarks();
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');

  const startEdit = (b) => { setEditingId(b.id); setEditNote(b.note || ''); };
  const saveEdit = (id) => { updateNote(id, editNote); setEditingId(null); };

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">Intel Dossier</div>
            <div className="page-subtitle">BOOKMARKED ARTICLES · ANALYST NOTES · PERSONAL INTELLIGENCE</div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>{bookmarks.length} SAVED</div>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📌</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 8 }}>NO SAVED INTELLIGENCE</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Bookmark articles from the Live Feed to build your personal intelligence dossier.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bookmarks.map(b => (
            <div key={b.id} className="card">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', marginBottom: 4 }}>{b.source}</div>
                  <a href={b.url} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5, display: 'block', marginBottom: 8 }}>{b.title}</a>
                  {editingId === b.id ? (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <textarea
                        className="input-field"
                        value={editNote}
                        onChange={e => setEditNote(e.target.value)}
                        placeholder="Add analyst note..."
                        style={{ flex: 1, minHeight: 60, resize: 'vertical', fontSize: 12 }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button className="btn-primary" style={{ fontSize: 11, padding: '6px 10px' }} onClick={() => saveEdit(b.id)}>SAVE</button>
                        <button onClick={() => setEditingId(null)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '6px 10px', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 11 }}>CANCEL</button>
                      </div>
                    </div>
                  ) : b.note ? (
                    <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 6, padding: '8px 12px', marginTop: 8 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', marginBottom: 4 }}>◎ ANALYST NOTE</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b.note}</div>
                    </div>
                  ) : null}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 8 }}>
                    Saved: {new Date(b.savedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => startEdit(b)} style={{ background: 'var(--accent-dim)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 4, padding: '4px 8px', color: 'var(--accent)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-mono)' }}>NOTE</button>
                  <button onClick={() => remove(b.id)} style={{ background: 'var(--accent2-dim)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 4, padding: '4px 8px', color: 'var(--accent2)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-mono)' }}>DEL</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
