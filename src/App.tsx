
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Employee from './pages/Employee'


function App() {
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
