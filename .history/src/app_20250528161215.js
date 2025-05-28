import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/autho.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import taskRoutes from './routes/task.routes.js';
import profileRoutes from './routes/profile.routes.js';
import friendsRoutes from './routes/friends.routes.js';
import path from 'path'; // Añadir esta línea al principio del archivo


const app = express();

app.use(cors({
    origin : 'http://localhost:5173',//especificar el origen permitido
    credentials : true
}));//haciendo uso de cors para permitir el acceso a la api desde cualquier origen

app.use('/uploads', 
    express.static(path.join(process.cwd(), 
    'uploads')));//para poder acceder a los archivos subidos a la carpeta uploads
app.use(morgan('dev'));
app.use(express.json());//convertir el body a json
app.use(cookieParser());//para poder leer las cookies


app.use('/api',authRoutes);
app.use('/api',taskRoutes);
app.use('/api', profileRoutes);
app.use()
app.use('/api/friends', friendsRoutes)

export default app;