import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/autho.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import taskRoutes from './routes/task.routes.js';3
import path from 'path'; // Añadir esta línea al principio del archivo


const app = express();

app.use(cors({
    origin : 'http://localhost:5173',//especificar el origen permitido
    credentials : true
}));//haciendp uso de cors para permitir el acceso a la api desde cualquier origen

app.use("/uploads", express.static(path.resolve("uploads")));//para poder acceder a los archivos subidos a la carpeta uploads
app.use(morgan('dev'));
app.use(express.json());//convertir el body a json
app.use(cookieParser());//para poder leer las cookies


app.use('/api',authRoutes);
app.use('/api',taskRoutes);

export default app;