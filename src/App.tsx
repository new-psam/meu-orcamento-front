import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Quando a URL for apenas a barra (/), mostra o Login */}
        <Route path="/" element={<Login />}/>

        {/* Quando a URL for /cadastro, mostra a tela de Registro */}
        <Route path='/cadastro' element={<Register/>}/>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}
