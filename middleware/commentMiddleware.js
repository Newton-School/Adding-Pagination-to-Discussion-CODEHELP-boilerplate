const Comment   = require("../models/comment.js");
const User   = require("../models/user.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "NEWTONSCHOOL";

/*

API --> /api/v1/comment/delete/:id or /api/v1/comment/update/:id
where id is comment id that need to delete or update.

req.body = { token }

Response

1. Missing Token

Status Code 401
json = 
{
    status: 'fail',
    message: 'Missing token'
}

2. Unabel to verify token (Invalid Token)

Status Code 401
json = 
{
    status: 'fail',
    message: 'Invalid token'
}

3. if comment with given id doesn't exist 

Status Code 404
json = {
    status: 'fail',
    message: 'Given Comment doesn't exist'
}

4. if the user login (the userId from the payload of JWT token) is not admin as well as not the author 
of the comment (authorId of the comment with given id) 

403 Status code
json = 
{
    status: 'fail',
    message: 'Access Denied'
}

5. Server error

500 Status code
json = 
{
    status: 'error',
    message: 'Unable to check'
}

6. No issue and the user login (the userId from the payload of JWT token) is either admin or the creator 
of the comment (authorId of the comment with given id)

200 Status code with allowing further.

*/

async function isoOwnerOrAdmin(req, res, next) {

    try {
        const commentId = req.params.id;
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
            const comment = await Comment.findById(commentId);
            const user       = await User.findById(loginUserId);
            if(String(comment.authorId) === loginUserId || user.role === 'admin'){
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
                message: "Given Comment doesn't exist"
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