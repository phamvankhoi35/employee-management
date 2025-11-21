import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Employee from './pages/Employee'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path='/' element={<Home />}>Home</Route>
          <Route path='/employee' element={<Employee />}>Employee</Route>
        </Routes>
      </BrowserRouter>
    </>
  ) 
}

export default App
