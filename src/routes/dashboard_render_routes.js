import express from 'express';
const router = express.Router();

import User from '../db/models/users.js';

// All routes here are prefixed with /onbording/dashboard (when mounted)
router.get('/onbording/dashboard',async (req,res)=>{
    
    const result = await User.find({}).select('userName').lean();  //return array of object  // always find returns an array
    
    const usernameList = result.map(user => user.userName);

    const data = {
        currUser:req.user.name,          //from jwt paload
        currUserId:req.user.uId,         //from jwt paload
        contacts:result
    } 

    res.status(200).json(data);   // 
})



// both works
// export { router as renderDashboard_route }
export default router ;