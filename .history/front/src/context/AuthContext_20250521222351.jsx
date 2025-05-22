import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth.js';


export const AuthContext = createContext();


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);

    const loadFriendsData = async () => {
        try {
            const [friendsRes, requestsRes] = await Promise.all([
                getMyFriends(),
                getFriendRequests()
            ]);
            setFriends(friendsRes.data);
            setRequests(requestsRes.data);
        } catch (error) {
            console.error("Error cargando amigos o solicitudes:", error);
        }
    };


    // Verificar el token al cargar la página
    useEffect(() => {
        async function checkLogin() {
            const token = Cookies.get('token');

            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const res = await verifyTokenRequest();
                if (!res.data) {
                    setIsAuthenticated(false);
                    setUser(null);
                } else {
                    setIsAuthenticated(true);
                    setUser(res.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error verifying token:', error);
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    const refreshUser = async () => {
        try {
            const res = await verifyTokenRequest(); // suponiendo que esta llamada trae el usuario actualizado
            setUser(res.data); // actualiza el usuario con la info más reciente
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        }
    };



    const signup = async (userData) => {
        try {
            const res = await registerRequest(userData);
            // NO setear user ni isAuthenticated para que no inicie sesión automáticamente
            setErrors([]); // limpia errores si hubo antes
            return true; // Indica que fue exitoso
        } catch (error) {
            // Aquí asigna el error que venga del backend
            setErrors(error.response?.data || ["Error desconocido"]);
            return false; // Indica que falló
        }
    };



    const sigin = async (user) => {
        try {
            const res = await loginRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
            setErrors([]);
            return true; // Indica éxito
        } catch (error) {
            setErrors(error.response.data);
            return false; // Indica error
        }
    };


    const logout = async () => {
        try {
            await axios.post(`${API}/logout`, {}, { withCredentials: true });
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Error en logout:", error);
        }
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);

            }, 5000)
            return () => clearTimeout(timer);
        }
    }, [errors])
    return (
        <AuthContext.Provider
            value={{
                signup,
                sigin,
                logout,
                user,
                isAuthenticated,
                errors,
                loading,
                refreshUser,
                friends,
                requests,
                loadFriendsData
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}