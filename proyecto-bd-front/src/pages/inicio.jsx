import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Inicio() {
    return (
        <div className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center text-center p-4"
            style={{ backgroundImage: `url(${logo})` }}>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
                <h1 className="text-4xl font-bold mb-6">Bienvenido a AutonomaNet</h1>
                <p className="mb-8 text-lg text-gray-600">
                    Conéctate con la comunidad UniAutonoma del Cauca
                </p>
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex flex-row space-x-4">
                        <Link to="/login">
                            <button className="bg-blue-400 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                                Iniciar sesión
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="bg-blue-400 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                                Registrarse
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default Inicio;
