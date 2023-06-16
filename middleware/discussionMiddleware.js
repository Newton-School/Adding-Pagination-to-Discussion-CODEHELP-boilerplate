const Discussion   = require("../models/discussion.js");
const User   = require("../models/user.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "NEWTONSCHOOL";

async function isoOwnerOrAdmin(req, res, next) {

    try {
        const discussionId = req.params.id;
        const token = req.body.token;

        if(!token){
            res.status(401).json({
                status: 'fail',
                message: 'Missing token'
            });
        }

        let decodedToken, loginUserId;
        try{
            decodedToken = jwt.verify(token, JWT_SECRET);
            loginUserId = decodedToken.userId;
        }catch(err){
            res.status(401).json({
                status: 'fail',
                message: 'Invalid token'
            })
        }

        try{
            const discussion = await Discussion.findById(discussionId);
            const user       = await User.findById(loginUserId);
            if(String(discussion.creator_id) === loginUserId || user.role === 'admin'){
                next();
            }
            else{
                res.status(403).json({
                    status: 'fail',
                    message: 'Access Denied'
                })
            }
        }catch(err){
            res.status(404).json({
                status: 'fail',
                message: "Given Discussion doesn't exist"
            })
        }   
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Unable to check'
        })
    }
}

module.exports = { isoOwnerOrAdmin };
