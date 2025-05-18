import mongoose from "mongoose";

export const connectDB = async () => {
  //conectando a la BD
  const user = 'juanbobadillaa';
  const password = 'root';
  const uri = `mongodb+srv://${user}:${password}@cluster0.igaz4.mongodb.net/`;
  try {
    await mongoose.connect(uri);
    console.log("Conexion exitosa");
  } catch (error) {
    console.error(error);
  }
};
