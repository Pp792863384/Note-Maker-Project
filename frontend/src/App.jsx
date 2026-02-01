import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Profile from './Pages/Profile.jsx'
import Login from './Pages/Login.jsx'
import SignUp from './Pages/signUp.jsx'
import CreateNote from './components/CreateNote.jsx'
export default function App() {
  return (
    <div>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/profile/:id' element ={<Profile/>}/>
          <Route path='/login' element ={<Login/>}/>
          <Route path='/signup' element ={<SignUp/>}/>
          <Route path='/createnote' element ={<CreateNote/>}/>
          <Route path='*' element ={<h1>404 Not Found</h1>}/>
      </Routes>
    </div>
  )
}
