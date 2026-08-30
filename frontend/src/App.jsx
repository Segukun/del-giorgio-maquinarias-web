import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/home.jsx"
import Catalog from "./pages/catalog.jsx"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
      </Routes>
    </Router>
  )
}

export default App