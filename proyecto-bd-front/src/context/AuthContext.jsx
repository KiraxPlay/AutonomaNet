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
            setIsAuthenticated(true);
            console.log(res);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const logout = () =>{
        setUser(null);
        setIsAuthenticated(false);
        navigate("/");
    }

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);

            }, 5000)
            return () => clearTimeout(timer);
        }
    } , [errors])
    return (
        <AuthContext.Provider
            value={{
                signup,
                sigin,
                logout,
                user,
                isAuthenticated,
                errors,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}