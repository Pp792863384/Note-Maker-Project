import React,{useState, useEffect} from 'react'
import styles from './Profile.module.css'
import axios from 'axios'
import CustomButton from '../components/CustomButton';
import Navigation from '../components/Navigation.jsx'
import {useNavigate} from 'react-router-dom'
const API_URL = import.meta.env.VITE_API_URL;
export default function Profile() {
  let navigate= useNavigate();
  let [err, setErr] = useState("");
  let [data, setData]= useState({});
  let token = JSON.parse(localStorage.getItem("userData"));
  let id=JSON.parse(localStorage.getItem("userData")).id;
  useEffect(()=>{
    fetchData();
  }, []);
  async function fetchData(){
    try {
      let res = await axios.get(`${API_URL}/profile/${id}`,{
        headers:{
          "Content-Type":"application/json",
          "authorization":`Bearer ${token.token}`
        }
      });
      console.log(res);
      if(res.status===200){
        alert("Profile data fetched");
        setData(res.data.data);
        // console.log(res.data.data);
      }
      else{
        setErr("Failed to fetch profile data");
      }
    } catch (error) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message || error.message || 'Failed to fetch profile';
      if (status === 403) {
        setErr('You can only view your own profile.');
      } else {
        setErr(msg);
      }
      console.log(error);
    }
  };
  function logoutHandler(){
    localStorage.removeItem("userData");
    alert("Logged out successfully");
    navigate("/login");
  }
  return (
    <><Navigation login='true' title='My Notes' username={data.name} id={id}/>
  
    <div className={styles.ProfileCard}>
      {err && <p className={styles.error}>{err}</p>}
      <h1 className={styles.title}>Profile</h1>
        <div className={styles.ProfileInfo}>
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Role:</strong> {data.role}</p>
        <p><strong>Phone:</strong> {data.phone}</p>
      </div>
      <CustomButton btnText="Refresh" Handler={fetchData} customStyle={styles.btn}/>
      <CustomButton btnText="Edit Profile" Handler={()=>alert("Feature coming soon")} customStyle={styles.btn}/>
        <CustomButton btnText="logout" Handler={logoutHandler}
          customStyle={styles.btn}/>
</div>
  </>
  )
}
