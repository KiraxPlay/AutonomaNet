import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
//lo que va a guardar 
    email : {
        type : String,
        required : true,
        unique : true,
    },
    username :{
        type : String,
        trim : true,
    },
    password :{
        type : String,
        required : true,
    }
},{
    timestamps : true //para que se guarde la fecha de creacion y actualizacion del usuario
})

export default mongoose.model("User", userSchema);//exporta el modelo de usuario