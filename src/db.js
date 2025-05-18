import mongoose from "mongoose";

export const connectDB = async () => {
  //conectando a la BD
  const user = 'usuario_mongoatlas';
  const password = 'contraseña_mongoAtlas';
  const uri = `mongodb+srv://${user}:${password}@tucluster.partedelcluster.mongodb.net/`;
  try {
    await mongoose.connect(uri);
    console.log("Conexion exitosa");
  } catch (error) {
    console.error(error);
  }
};
