import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest } from '../api/auth.js';
import { useNavigate } from "react-router-dom"; // Importa useNavigate


export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Verificar el token al cargar la página
    useEffect(() => {
        async function checkLogin() {
            const token = localStorage.getItem("token")

            if (token) {
                try {
                    const res = await verifyTokenRequest()
                    if (res.data) {
                        setUser(res.data)
                        setIsAuthenticated(true)
                    }
                } catch (error) {
                    console.error(error)
                }
            }
            setLoading(false)
        }
        checkLogin()
    }, [])



    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            console.log(res.data);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const sigin = async (user) => {
        try {
            const res = await loginRequest(user);
            localStorage.setItem("token", res.data.token); // Guardar el token en localStorage
            setUser(res.data.user); // Guardar el usuario en el estado
            setIsAuthenticated(true);
            console.log(res);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        setIsAuthenticated(false)
    }

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
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}