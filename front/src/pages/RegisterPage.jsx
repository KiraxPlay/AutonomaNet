import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const { signup, errors: AuthErrors } = useAuth(); // El hook auth
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (values) => {
        const success = await signup(values);
        if (success) {
            // Si se registra correctamente, redirige a login
            navigate('/login');
        }
    });

    useEffect(() => {
        document.title = "Registro";
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="hidden md:block md:w-1/2">
                <img src="/AUTONOMANET.png" alt="logo" className="w-[600px] h-[400px] rounded-lg shadow-md" />
            </div>
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                    Registrarse
                </h2>

                {/* Mostrar errores si los hay */}
                {AuthErrors?.length > 0 && AuthErrors.map((error, i) => (
                    <div className="bg-red-600 p-4 text-white mb-2" key={i}>
                        {error}
                    </div>
                ))}

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Campos de formulario ... */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            {...register("email", { required: "El correo es obligatorio" })}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="correo electrónico"
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Usuario</label>
                        <input
                            type="text"
                            {...register("username", { required: "El usuario es obligatorio" })}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tu nombre de usuario"
                        />
                        {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: "La contraseña es obligatoria",
                                maxLength: { value: 6, message: "Máximo 6 caracteres" }
                            })}
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
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Confirmar Contraseña</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("confiPassword", { required: "Confirma la contraseña" })}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="**********"
                        />
                        {errors.confiPassword && <span className="text-red-500 text-sm">{errors.confiPassword.message}</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Registrar
                    </button>

                    <Link to="/login" className="text-blue-500 hover:underline text-sm text-center block mt-4">
                        ¿Ya tienes cuenta? Inicia sesión.
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
