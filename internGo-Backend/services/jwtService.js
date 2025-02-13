import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const jwtSign = async (id, role, name, email) => {
    const token = jwt.sign({ userId: id, name: name, role: role, email: email }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRES_IN });
    return token;
}
export const jwtVerify = (token) => {
    try {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(user);
                }
            });
        });
    }
    catch(error){
        logger.error(error.message)
    }
    
}

export const jwtDecode = (token) => {
    return jwt.decode(token)
}