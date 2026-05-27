import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Dashboard from './Dashboard/Dashboard'
import Signup from './SignUp/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreateTask from './CreateTask/CreateTask'

function App() {

  

  return (
    <>
      {/* <Signup/> */}
      {/* <Dashboard /> */}
      {/* <AddTask /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<Dashboard/>}/>
          <Route path="/create-task" element={<CreateTask/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
