import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import logo from '../assets/logo.png';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';


function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { sigin, errors: sigInErrors } = useAuth(); // 👈 hook de contexto para el inicio de sesión
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (data) => {
        try {
            const success = await sigin(data);
            if (success) {
                navigate('/home');
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    });

    useEffect(() => {
        document.title = "Inicio de Sesión";
    }, []);

    return (
        <div className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center text-center p-4"
            style={{ backgroundImage: `url(${logo})` }}>
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Iniciar Sesión</h2>
                {
                    sigInErrors?.map((error, i) => (
                        <div className="bg-red-600 p-4 text-white" key={i}>
                            {error}
                        </div>
                    ))
                }
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="correo electrónico"
                        />
                    </div>

                    {errors.email && <span className="text-red-500 text-sm">Este  campo es  requerido</span>}

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
                        <input
                            type={showPassword ? "text" : "password"} // 👈 toggle aquí
                            {...register("password", { required: true })}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="**********"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-sm text-blue-600 hover:underline focus:outline-none"
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    {errors.password && <span className="text-red-500 text-sm">Este  campo es requerido</span>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Iniciar Sesión
                    </button>

                    <Link to="/register" className="text-blue-500 hover:underline text-sm text-center block mt-4">
                        ¿No tienes cuenta? Registrate.
                    </Link>
                </form>
            </div>

        </div>

    )
}

export default LoginPage;