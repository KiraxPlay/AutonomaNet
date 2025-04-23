import mongoose  from "mongoose";


export const connectDB = async () => {
    //conectando a la BD
    try {
        await mongoose.connect('mongodb://localhost:27017/proyecto');
        console.log('Conexion exitosa');
    } catch (error) {
        console.error(error);
    }
}