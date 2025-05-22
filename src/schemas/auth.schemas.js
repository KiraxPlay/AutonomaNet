import {z} from 'zod';

export const registerSchema = z.object({//validacion de usuario
    //       tipo string , 
    username : z.string({
        required_error: 'El nombre de usuario es requerido'
    }),
    email: z.string({
        required_error: 'El correo es requerido'
    }).email({
        message: 'El correo no es valido'
    }),
    password: z.string({
        required_error: 'La contraseña es requerida'
    }).min(6, {
        message: 'La contraseña debe tener al menos 6 caracteres'
    }).max(15, {
        message: 'La contraseña no puede tener mas de 15 caracteres'
    }),
});

export const loginSchema = z.object({//validacion de usuario
    
    email: z.string({
        required_error: 'El correo es requerido'
    }).email({
        message: 'El correo no es valido'
    }),
    password: z.string({
        required_error: 'La contraseña es requerida'
    }).min(6, {
        message: 'La contraseña debe tener al menos 6 caracteres'
    }),
});