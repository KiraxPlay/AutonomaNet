import jwt from "jsonwebtoken"; //importando jwt para verificar el token
import { TOKEN_SECRET } from "../config.js";

//                       res(informacion de la peticion),
//                 req(respuesta),
//                       next(funcion que permite continuar con el flujo de la peticion)
export const authRequired = (req , res , next) => {
    const {token} = req.cookies; //obteniendo el token de las cookies
    if(!token) return res.status(401).json({message : "NO ESTAS AUTORIZADO..."}); //si no hay token, devuelve un error

    jwt.verify(token , TOKEN_SECRET , (err , user) => {
        if(err) return res.status(403).json({message : "token Invalido"});
        
        req.user = user //si el token es valido, devuelve la informacion del usuario
    });
    next(); //si el token es valido, continua con el flujo de la peticion
    
};