import jwt from 'jsonwebtoken';

export const jwtSign=async(name,email)=>{
    const token=jwt.sign({name:name,email:email},process.env.SECRET_KEY,{expiresIn:process.env.EXPIRES_IN});
    return token
}
export const jwtVerify=(token)=>{
    return new Promise((resolve,reject)=>{
    jwt.verify(token,process.env.SECRET_KEY,(error,user)=>{
        if(error){
            reject(error);
        }
        else{
            resolve(user);
        }
    });
    });
    
}