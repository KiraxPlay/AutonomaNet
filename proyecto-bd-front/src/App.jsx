import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import Inicio from './pages/inicio';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/task' element={<h1>publicaciones</h1>} />
          <Route path='/add-task' element={<h1>nueva publicacion</h1>} />
          <Route path='/task/:id' element={<h1>actualizar publicacion</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;