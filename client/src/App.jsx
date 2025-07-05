import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Menu from './pages/Menu'
import Employee from './pages/Employee'
import Comments from './pages/Comments'
import OutOfStock from './pages/OutOfStock'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/out-of-stock" element={<OutOfStock />} />
      </Routes>
    </div>
  )
}

export default App
