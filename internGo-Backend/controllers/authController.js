import sendResponse from "../utils/response.js";
import {
    createIntern,
    findUserByEmail,
    createUser,
    updateUser,
} from "../models/userModel.js";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
import { jwtDecode, jwtSign, jwtVerify } from "../services/jwtService.js";
import { findRoleByName, updateRole } from "../models/roleModel.js";
import { sendEmail } from "../services/mailService.js";
import { createOtpRecord, deleteOtpRecord, getOtpByEmail } from "../models/otpStorageModel.js";
import crypto from 'crypto'


export const sendOTP = async (req, res) => {
    try {
        const newUser = req.body;
        const userDetails = await findUserByEmail(newUser.email);
        if (userDetails) {
            if (!userDetails.password) {
                logger.error(
                    "Already signed up with google. Please continue with google."
                );
                return sendResponse(
                    res,
                    409,
                    "Already signed up with google. Please continue with google."
                );
            }
            logger.error("Already signed up. Please login.");
            return sendResponse(res, 409, "Already signed up. Please login.");
        }
        const otp = crypto.randomInt(1000, 9999);
        const expiryMinutes = parseInt(process.env.OTP_EXPIRY) || 10;
        const expiresAt = new Date();
        console.log(expiryMinutes,expiresAt,otp)
        expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

        await createOtpRecord({ email: newUser.email, details: newUser, otp: otp+"", expires_at: expiresAt})
        const body = 
        `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Account</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                <img src="https://intern-go.s3.eu-north-1.amazonaws.com//internGO_logo/Intern+(3).png" alt="InternGO Logo" style="width: 200px; margin-bottom: 20px; height: 75px;">
                <h2 style="color: #333;">Account Verification</h2>
                <p>Welcome ${newUser.name},</p>
                <p>Thank you for signing up. Please use the OTP below to verify your account:</p>
                <p style="font-size: 24px; font-weight: bold; color: #007BFF; margin: 20px 0;">${otp}</p>
                <p>This OTP is valid for 10 minutes. Please enter it to complete your account setup.</p>
                <p style="margin-top: 20px; color: #888;">If you did not sign up for this account, please ignore this email.</p>
                <p style="font-size: 12px; color: #888;">Best, <br><b>InternGO Team</b></p>
            </div>
        </body>
        </html>`;
        await sendEmail(newUser.email,'Complete Your InternGO Sign-Up - Verify Your Account',body);
        sendResponse(res, 200, "OTP sent successfully!!!");
        logger.info("OTP sent successfully!!!");
    }
    catch (error) {
        logger.error(error.message);
    }
}

// export const signUpController = async (req, res) => {
//     try {
//         const newUser = req.body;
//         const userDetails = await findUserByEmail(newUser.email);
//         if (userDetails) {
//             if (!userDetails.password) {
//                 logger.error(
//                     "Already signed up with google. Please continue with google."
//                 );
//                 return sendResponse(
//                     res,
//                     409,
//                     "Already signed up with google. Please continue with google."
//                 );
//             }
//             logger.error("Already signed up. Please login.");
//             return sendResponse(res, 409, "Already signed up. Please login.");
//         }
//         const hashedPassword = await bcrypt.hash(newUser.password, parseInt(process.env.SALT_ROUNDS));
//         newUser.password = hashedPassword;

//         await createIntern(newUser);
        // sendResponse(res, 201, "Sign Up successful!!!");
        // logger.info("Sign Up successful!!!");
//     } catch (error) {
//         logger.error(error.message);
//     }
// };

export const verifyOTP = async(req,res)=>{
    try{
        const request=req.body;
        const userDetails=await getOtpByEmail(request.email);
        if(!userDetails){
            logger.error("User does not exist. Please sign up.");
            return sendResponse(res, 404, "User does not exist. Please sign up.");
        }
        const now=new Date();
        if (request.otp !== userDetails.otp) {
            logger.error("Invalid OTP.");
            return sendResponse(res,403,"Invalid OTP.");
        }
        if (new Date(userDetails.expires_at) < now) {
            logger.error("OTP has expired.");
            return sendResponse(res,403,"OTP has expired.");
        }
        userDetails.details.password=await bcrypt.hash(userDetails.details.password,parseInt(process.env.SALT_ROUNDS))
        await createIntern(userDetails.details);
        await deleteOtpRecord(request.email);
        
        sendResponse(res, 201, "Sign Up successful!!!");
        logger.info("Sign Up successful!!!");
    }
    catch(error)
    {
        logger.error(error.message);
    }
}

export const oauthController = async (req, res) => {
    try {
        const credential = req.body;
        // console.log(user);
        const user = jwtDecode(credential.credential);
        let existingUser = await findUserByEmail(user.email);
        if (!existingUser) {
            const newUser = {
                name: user.name,
                email: user.email,
                password: null,
            };
            existingUser = await createIntern(newUser);
        }

        const token = await jwtSign({
            userId: existingUser.id,
            role: existingUser.role.roleName,
            name: existingUser.name,
            email: existingUser.email
        });
        if (existingUser.profilePhoto) {
            existingUser.profilePhoto = process.env.AWS_BUCKET_DOMAIN + existingUser.profilePhoto;

        }
        const response = {
            userId: existingUser.id,
            name: existingUser.name,
            role: existingUser.role.roleName,
            permissions: existingUser.role.permissions,
            token: token,
            zone: existingUser.zone,
            profilePhoto: existingUser.profilePhoto
        };
        sendResponse(res, 200, "Oauth Successful!!!", response);
        logger.info("Oauth successful!!!");
    } catch (error) {
        logger.error(error.message);
    }
};
export const signInController = async (req, res) => {
    try {
        const user = req.body;
        const existingUser = await findUserByEmail(user.email);
        if (!existingUser) {
            logger.error("User does not exist. Please sign up.");
            return sendResponse(res, 404, "User does not exist. Please sign up.");
        }
        if (existingUser.password === "Nil") {
            logger.error("User signed in with google. Please continue with google.");
            return sendResponse(
                res,
                409,
                "User signed in with google. Please continue with google."
            );
        }
        const passwordMatch = await bcrypt.compare(
            user.password,
            existingUser.password
        );
        if (!passwordMatch) {
            logger.error("Invalid password");
            return sendResponse(res, 401, "Invalid password");
        }
        const token = await jwtSign({
            userId: existingUser.id,
            role: existingUser.role.roleName,
            name: existingUser.name,
            email: existingUser.email
        });
        if (existingUser.profilePhoto) {
            existingUser.profilePhoto = process.env.AWS_BUCKET_DOMAIN + existingUser.profilePhoto;

        }
        const response = {
            userId: existingUser.id,
            name: existingUser.name,
            role: existingUser.role.roleName,
            permissions: existingUser.role.permissions,
            token: token,
            zone: existingUser.zone,
            profilePhoto: existingUser.profilePhoto
        };

        sendResponse(res, 200, "Login successful!!!", response);
        logger.info("Login successful!!!");
    } catch (error) {
        logger.error(error.message);
    }
};
export const createUserController = async (req, res) => {
    try {
        const userDetails = await findUserByEmail(req.body.email);
        const roleName = req.body.role;
        // console.log(roleName)
        const role = await findRoleByName(roleName);
        if (userDetails) {
            logger.error("Already signed up. Please login.");
            return sendResponse(res, 409, "Already signed up. Please login.");
        }
        if (!role) {
            logger.error("Invalid role.");
            return sendResponse(res, 404, "Invalid role.");
        }
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            roleId: role.id,
        };
        await createUser(newUser);
        sendResponse(res, 201, `${role.roleName} created successfully!!!`);
        logger.info(`${role.roleName} created successfully!!!`);
    } catch (error) {
        logger.error(error.message);
    }
};

export const updateUserPermission = async (req, res) => {
    try {
        const { roleName, permissions } = req.body;
        if (!permissions) {
            logger.error("Invalid permissions!!");
            return sendResponse(res, 400, "Invalid permissions!!");
        }
        const role = await findRoleByName(roleName);
        const updatedPermissions = {
            permissions: role.permissions.concat(permissions),
        };

        await updateRole(role.id, updatedPermissions);
        logger.info("Updated permissions successfully");
        return sendResponse(res, 200, "Updated permissions successfully");
    } catch (error) {
        logger.error(error.message);
    }
};

export const verifyToken = async (req, res) => {
    try {
        const token = req.body.token;
        console.log(token);
        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }

        await jwtVerify(token);
        logger.info("Successfully verified");
        return sendResponse(res, 200, "Success");
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return sendResponse(res, 401, "Invalid token");
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const email = req.body;
        const existingUser = await findUserByEmail(email.email);
        if (!existingUser) {
            logger.error("User does not exist. Please sign up.");
            return sendResponse(res, 404, "User does not exist. Please sign up.");
        }
        const token = await jwtSign({
            email: existingUser.email
        })
        const resetLink = `https://interngo.vercel.app/reset-password?token=${token}`
        const body =
            `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your Password</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                    <img src="https://intern-go.s3.eu-north-1.amazonaws.com//internGO_logo/Intern+(3).png" alt="InternGO Logo" style="width: 200px; margin-bottom: 20px;height:75px;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Hello ${existingUser.name},</p>
                    <p>You recently requested to reset your password. Click the button below to proceed:</p>
                    <a href="${resetLink}" style="display: inline-block; background-color: #007BFF; color: #ffffff; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-size: 16px;">Reset Password</a>
                    <p style="margin-top: 20px; color: #888;">If you did not request this, please ignore this email.</p>
                    <p style="font-size: 12px; color: #888;">Best, <br><b>InternGO Team</b></p>
                </div>
            </body>
            </html>`

        sendEmail(existingUser.email, `InternGO - Reset Your Password`, body);
        sendResponse(res, 200, "Check your email for the reset link!!!!")
    }
    catch (error) {
        logger.error(error.message);
    }
}

export const resetPassword = async (req, res) => {
    try {
        const password = req.body;
        // if(!token)
        // {
        //     logger.error("Token not present!!!")
        //     return sendResponse(res,401,"Token not present!!!");
        // }
        const user = req.user;

        const existingUser = await findUserByEmail(user.email);
        if (!existingUser) {
            logger.error("User does not exist. Please sign up.");
            return sendResponse(res, 404, "User does not exist. Please sign up.");
        }
        const hashedPassword = await bcrypt.hash(password.password, parseInt(process.env.SALT_ROUNDS))
        await updateUser(existingUser.id, {
            password: hashedPassword
        });
        logger.info("Password updated successfully!!!")
        sendResponse(res, 200, "Password updated successfully!!!")
    }
    catch (error) {
        logger.error(error.message);
    }
}