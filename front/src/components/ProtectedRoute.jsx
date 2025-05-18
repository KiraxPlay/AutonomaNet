import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
    const { loading, isAuthenticated } = useAuth()

    if(loading) {
        return <h1>Cargando...</h1> // Mostrar un mensaje de carga mientras se verifica la autenticación
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace /> // Redirigir a la página de inicio de sesión si no está autenticado
    }
    return <Outlet /> // Renderizar el componente hijo si está autenticado
}

export default ProtectedRoute;