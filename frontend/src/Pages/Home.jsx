import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation.jsx';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Leftnav from '../components/Leftnav.jsx';


export default function Home() {
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token = userData?.token;
    if (!token) {
      navigate('/login');
    } else {
      setUsername(userData.name);
      setId(userData.id);
    }
  }, [navigate]);

  return (
    <div className={styles.page}>
      <Navigation login="true" title="Digital Notes" username={username} id={id} />
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.left_top}>
            {/* <h1 className={styles.heading}>My Notes</h1> */}
          </div>
          <Leftnav
            onSelectNote={(note) => setSelectedNote(note)}
            selectedNoteId={selectedNote?._id}
          />
        </div>

        <div className={styles.right}>
          <div className={styles.right_top}>
            <h1 className={styles.headingRight}>My Notes</h1>
          </div>
          {selectedNote ? (
            <div className={styles.detailCard}>
              <h2 className={styles.detailTitle}>{selectedNote.title}</h2>
              <p className={styles.detailContent}>{selectedNote.content}</p>
            </div>
          ) : (
            <p className={styles.placeholder}>
              Welcome to MyNotes! Select a note from the left sidebar to view its content.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
