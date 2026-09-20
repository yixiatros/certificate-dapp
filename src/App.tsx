import './App.css'
import Footer from './Components/Footer/Footer'
import Navbar from './Components/Navbar/Navbar'
import { Outlet } from 'react-router'

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-[68.5vh] flex items-center justify-center">
      <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default App
