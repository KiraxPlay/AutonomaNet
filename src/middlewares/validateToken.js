import jwt from "jsonwebtoken"; //importando jwt para verificar el token
import { TOKEN_SECRET } from "../config.js";

//                       res(informacion de la peticion),
//                 req(respuesta),
//                       next(funcion que permite continuar con el flujo de la peticion)
export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(401).json({ message: "NO ESTAS AUTORIZADO..." });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "token Invalido" });

    req.user = user;
    next();
  });
};
