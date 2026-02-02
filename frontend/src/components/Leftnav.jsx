import React, { useCallback, useEffect, useState } from 'react';
import styles from './Leftnav.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomButton from './CustomButton.jsx';

const API_URL = import.meta.env.VITE_API_URL;

export default function Leftnav({ onSelectNote, selectedNoteId }) {
  const navigate = useNavigate();
  const [error, setErr] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const storedToken = userData?.token;

    if (!storedToken) {
      navigate('/login');
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  const fetchNotes = useCallback(async () => {
    if (!token) return;
    try {
      setErr('');
      const response = await axios.get(`${API_URL}/notes`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });
      setNotes(response.data.data || []);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err.message || 'Failed to load notes';
      if (status === 403) {
        setErr("You don't have access to notes. Please log in again.");
      } else {
        setErr(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchNotes();
  }, [token, fetchNotes]);

  const handleMigrate = async () => {
    if (!token) return;
    setMigrating(true);
    setErr('');
    try {
      const res = await axios.post(`${API_URL}/notes/migrate`, {}, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });
      const count = res.data?.data?.modifiedCount ?? 0;
      if (count > 0) {
        await fetchNotes();
        alert(`Migrated ${count} note(s) to your account.`);
      } else {
        alert('No notes without user ID found.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Migration failed';
      setErr(msg);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Loading...</p>}

      <div className={styles.headerRow}>
        <h2 className={styles.sidebarTitle}>My Notes</h2>
        <CustomButton
          btnText="+ New Note"
          Handler={() => navigate('/createnote')}
          customStyle={styles.newNoteBtn}
        />
      </div>

      <div className={styles.migrateSection}>
        <button
          type="button"
          className={styles.migrateBtn}
          onClick={handleMigrate}
          disabled={migrating || !token}
        >
          Migrate Notes
        </button>
        <p className={styles.migrateHint}>
          Click this if you have existing notes without user ID
        </p>
      </div>

      {!loading && !error && notes.length === 0 && (
        <p className={styles.empty}>No notes yet. Create your first note.</p>
      )}

      {notes.length > 0 && (
        <div className={styles.container}>
          {notes.map((note) => (
            <button
              key={note._id}
              type="button"
              className={`${styles.note} ${
                note._id === selectedNoteId ? styles.noteActive : ''
              }`}
              onClick={() => onSelectNote && onSelectNote(note)}
            >
              <span className={styles.noteTitle}>{note.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
