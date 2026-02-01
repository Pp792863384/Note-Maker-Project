import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CreateNote.module.css";

export default function CreateNote({ onCreated }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userData"))?.token || "";
    } catch {
      return "";
    }
  }, []);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !loading;

  async function submitHandler(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Please enter both title and content.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/notes",
        { title: title.trim(), content: content.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        setTitle("");
        setContent("");
        setSuccess("Note created.");
        alert("Note created successfully");
        navigate("/");
        if (typeof onCreated === "function") {
          onCreated(res.data?.data);
          
        }
      } else {
        setError("Failed to create note.");
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create note.";
      if (status === 403) {
        setError("You don't have access. Please log in again.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Create note</h2>
        <p className={styles.subtitle}>Add a title and content, then save.</p>
      </div>

      <form className={styles.form} onSubmit={submitHandler}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <label className={styles.label}>
          <span>Title</span>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Meeting notes"
            autoComplete="off"
            maxLength={80}
          />
        </label>

        <label className={styles.label}>
          <span>Content</span>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            rows={6}
          />
        </label>

        <div className={styles.actions}>
          <button className={styles.btn} type="submit" disabled={!canSubmit}>
            {loading ? "Saving..." : "Save note"}
          </button>
          <button
            className={styles.btnSecondary}
            type="button"
            onClick={() => {
              setTitle("");
              setContent("");
              setError("");
              setSuccess("");
            }}
            disabled={loading}
          >
            Clear
          </button>
        </div>

        <p className={styles.hint}>
          Notes are saved to your account and only you can see them.
        </p>
      </form>
    </div>
  );
}
