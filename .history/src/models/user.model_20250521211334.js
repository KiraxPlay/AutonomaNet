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
    },
    profilePicture :{
        type : String,
        default : null,
    },
    profilePicture
  
    friends : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }],
    friendsRequests : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }],//Se refiere a las solicitudes de amistad que ha recibido el usuario
    sentRequests : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }],//Se refiere a las solicitudes de amistad que ha enviado el usuario
},{
    timestamps : true //para que se guarde la fecha de creacion y actualizacion del usuario
})

export default mongoose.model("User", userSchema);//exporta el modelo de usuario