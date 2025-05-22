  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  import LoginPage from './pages/LoginPage';
  import RegisterPage from './pages/RegisterPage';
  import HomePage from './pages/HomePage';
  import Inicio from './pages/inicio';
  import ProtectedRoute from './components/ProtectedRoute';
  import { AuthProvider } from './context/AuthContext';
  import FriendsPage from './pages/FriendsPage';

  function App() {
    return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Inicio />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            {/*rutas protegidas*/}
            <Route element={<ProtectedRoute />}>
              <Route path='/home' element={<HomePage />} />
              <Route path='/friends' element={<FriendsPage />} />
              <Route path='/task' element={<h1>publicaciones</h1>} />
              <Route path='/add-task' element={<h1>nueva publicacion</h1>} />
              <Route path='/task/:id' element={<h1>actualizar publicacion</h1>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    )
  }

  export default App;