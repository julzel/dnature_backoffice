import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Facturacion from './pages/Facturacion'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/facturacion" element={<Facturacion />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
