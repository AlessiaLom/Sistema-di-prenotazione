import Navbar from "./Navbar"
import Booking from "./pages/Booking"
import Cancelation from "./pages/Cancelation"
import Logo from "./Logo"
import { Route, Routes } from "react-router-dom"
import Footer from "./Footer"

function App() {
  return (
    <>
      <Logo />
      <Navbar />
      <div className="container">
        <Routes>
          <Route path ="/" element={<Booking />} />
          <Route path="/logo" element={<Logo />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/cancelation" element={<Cancelation />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App