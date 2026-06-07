import express from 'express';
const router = express.Router();

//importing redis client
import {redisClient} from '../../redis.js';

import User from '../db/models/users.js';
import messageModel from '../db/models/messages.js';

// All routes here are prefixed with /onbording/dashboard (when mounted)
router.get('/onbording/dashboard', async (req, res) => {
    try {
        const result = await User.find({}).select('userName').lean();

        const key = `user:unreadCounts:${req.user.uId}`;

        // ✅ Fixed: Use Promise.all() to wait for all async calls
        const usernameList = await Promise.all(
            result.map(async (user) => {
                const roomid = messageModel.buildRoomId(req.user.uId, user._id);

                const uUnread = await redisClient.hGet(key, roomid);

                return {
                    contactid: user._id,
                    cuserName: user.userName,
                    unreadCount: uUnread ? parseInt(uUnread, 10) : 0
                };
            })
        );

        const data = {
            currUser: req.user.name,
            currUserId: req.user.uId,
            contacts: usernameList
        };

        console.log(data);
        res.status(200).json(data);

    } catch (error) {
        console.error("Dashboard route error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// both works
// export { router as renderDashboard_route }
export default router ;