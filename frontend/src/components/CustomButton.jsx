import React from 'react'
import styles from './CustomButton.module.css'
export default function CustomButton({btnText="",customStyle="" , Handler=()=>{}}) {
  return (
    <button className={`${styles.Defaultstyle} ${customStyle}`} onClick={Handler}>{btnText||"Submit"}</button>
  )
}
