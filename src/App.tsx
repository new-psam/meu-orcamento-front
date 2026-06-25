import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    // O AuthProvider abraça todo o aplicativo
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Quando a URL for apenas a barra (/), mostra o Login */}
          <Route path="/" element={<Login />}/>

          {/* Quando a URL for /cadastro, mostra a tela de Registro */}
          <Route path='/cadastro' element={<Register/>}/>

          {/* Todas as rotas que ficarem dentro deste bloco exigirão login */}
          <Route element={<ProtectedRoute />}>
            <Route path='/dashboard' element={<Dashboard />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
