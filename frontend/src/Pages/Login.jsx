import React, {useState} from 'react'
import styles from './Login.module.css'
import CustomButton from '../components/CustomButton.jsx'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  let navigate= useNavigate();
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [err, setErr]=useState("");

  const handleSubmit= async (e)=>{
    e.preventDefault();
    setErr("");
    if(!email){
      setErr("Please enter your email");
      return;
  }
  if(!password){
      setErr("Please enter your password");
      return;
  }
  
  try {
    const API_URL = import.meta.env.VITE_API_URL;

let res = await axios.post(
  `${API_URL}/login`,
  { email, password },
  {
      headers:{
        "Content-Type":"application/json" 
      }
    });
    if(res.status==200){
      alert("Login sucessful!");
      localStorage.setItem("userData", JSON.stringify(res.data.data));
      navigate("/");
  } 
  else{
      setErr("Login failed");
  }
}
  catch (error) {
    setErr("Login failed");
  }
// console.log("Login Button Clicked", email, password);
  }

  return (
    
    <div className={styles.login}>
        <h1 className={styles.heading}>Login to Continue</h1>
        {err && <p className={styles.error}>{err}</p>}
     <form className={styles.form}>
        <input type="email" placeholder='Email' className={styles.inputField} onChange={(e)=>setEmail(e.target.value)}/>
        <input type="password" placeholder='Password' className={styles.inputField} onChange={(e)=>setPassword(e.target.value)}/>
        <CustomButton btnText='Login' Handler={handleSubmit}/>
     </form>
     <p>Don't have Account ? <Link to={"/signup"}>Click here for SignUp</Link></p>
    </div>
  )
}
