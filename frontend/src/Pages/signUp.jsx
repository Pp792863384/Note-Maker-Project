import React, { useState } from "react";
import styles from "./Login.module.css";
import CustomButton from "../components/CustomButton.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
export default function signUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [cpass, setCpass] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const handleSubmit =async (e) => {
    e.preventDefault();

    if (!name) {
      setErr("Please enter your name");
      return;
    }
    if (!email) {
      setErr("Please enter your email");
      return;
    }
    if (!password) {
      setErr("Please enter your password");
      return;
    }
    if (password !== cpass) {
      setErr("Passwords do not match");
      return;
    }
    if (!role) {
      setErr("Please select your role");
      return;
    }
    if (phone.length !== 10) {
      setErr("Please enter valid mobile number");
      return;
    }
    setErr("");

    console.log(name, email, password, role, phone);
    // let payload = { name, email, password, role, phone };
    try {
      const res = await axios.post(
        `${API_URL}/register`,
        { name, email, password, role, phone }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status == 201) {
        alert("Registration Successful");
        navigate("/login");
      } else {
        setErr("Registration Failed");
        return;
      }
    } catch (err) {
      setErr("Registration Failed");
      return;
    }
    
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.heading}>Login to Continue</h1>
      {err && <p className={styles.error}>{err}</p>}
      <form className={styles.form}>
        <input
          type="text"
          placeholder="Enter your name"
          className={styles.inputField}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter your email"
          className={styles.inputField}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Create Password"
          className={styles.inputField}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className={styles.inputField}
          onChange={(e) => setCpass(e.target.value)}
        />
        <select
          className={styles.select}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="guest">Guest</option>
        </select>
        <input
          type="number"
          placeholder="Enter your mobile number"
          onChange={(e) => setPhone(e.target.value)}
          className={styles.inputField}
        />
        <CustomButton btnText="Register" Handler={handleSubmit} />
      </form>
      {/* <p><Link to={"/login"}>Click here for Login</Link></p> */}
    </div>
  );
}
