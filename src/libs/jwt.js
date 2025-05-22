import {TOKEN_SECRET} from "../config.js";
import jwt from "jsonwebtoken"; //importando la libreria jsonwebtoken para crear el token

export function createAccesToken(payload){
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, //payload es el objeto que contiene la informacion del usuario
            TOKEN_SECRET, //la clave secreta para firmar el token
            {
                expiresIn : "1d" //el token va a expirar en 1 dia
            },
            (err , token) =>{
                if(err) reject(err);
                resolve(token); //si no hay error, se resuelve la promesa con el token
            }
        );
 });

 

}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded); // { id: ... }
    });
  });
}
 
    


    