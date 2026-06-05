import express from 'express';
import jwt from 'jsonwebtoken';

import User from'../db/models/users.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/api/login',async (req,res)=>{
   
    console.log("Received body:", req.body);     // ← debug line – very helpful

     
    try {
        const { userName, password } = req.body;
        
        
        // 1. Basic input validation
        if (!userName || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }
        
        // 2. Find user by username (case sensitive)
        const user = await User.findOne({ userName: userName.trim() });
        
        // 3. Username not found
        if (!user) {
            
            return res.status(401).json({
                
                success: false,
                message: "Invalid username or password"
            });
        }
        
        // 4. Check password (plain text comparison - NOT SECURE in production!)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // 5. Login success
        // creating a JWT/session :
        console.log(user._id);
        const payload = {
            name: userName,
            uId: user._id
            // iat & exp added automatically by jwt.sign if expiresIn is set
        };

        const accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '60m'          // short-lived access token (best practice)
        });
        
        

        return res.status(200).json({
            success: true,
            token: accessToken,
            message: "User logged in successfully",
        });

    } catch(error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message
        });
    }
});




export default router;