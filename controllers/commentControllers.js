const Comment   = require("../models/comment.js");
const Discussion   = require("../models/discussion.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'NEWTONSCHOOL';

const createComment = async (req, res) => {

    const {content, discussionId, token } = req.body;

    try{
        if(!token){
            res.status(401).json({
                status: 'fail',
                message: 'Missing token'
            });
        }
        let decodedToken;
        try{
            decodedToken = jwt.verify(token, JWT_SECRET);
        }catch(err){
            res.status(401).json({
                status: 'fail',
                message: 'Invalid token'
            });
        }
        try{
            const discussion = await Discussion.findById(discussionId);
            const newComment = {
                content,
                authorId: decodedToken.userId,
                discussionId
            };
            const comment = await Comment.create(newComment);
            res.status(200).json({
                message: 'Comment added successfully',
                commentId: comment._id,
                status: 'success'
            });
        }catch(err){
            res.status(404).json({
                message: "Discussion with given discussionId doesn't exist",
                status: 'fail'
            });
        }
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

const getComment = async (req, res) => {

    const commentId = req.params.id;
    try{
        try{
            const comment = await Comment.findById(commentId);
            res.status(200).json({
                status: 'success',
                comment
            })
        }catch(err){
            res.status(404).json({
                status: 'fail',
                message: "Given Comment doesn't exist"
            });
        }
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

const deleteComment = async (req, res) => {

    try{
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if(!comment)
        {
            res.status(404).json({
                status: 'fail',
                message: "Given Comment doesn't exist"
            })
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({
            status: 'success',
            message: 'Comment deleted successfully'
        })
        
    }catch(err){
        console.log(err.message);
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

const updateComment = async (req, res) => {

    const id = req.params.id;
    const content = req.body.content;
    try{
        const comment = await Comment.findById(id);
        if(!comment)
        {
            res.status(404).json({
                status: 'fail',
                message: "Given Comment doesn't exist"
            })
        }
        await Comment.findByIdAndUpdate(id, { content });
        res.status(200).json({
            status: 'success',
            message: 'Comment updated successfully'
        });
    } catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    };

}

module.exports = { createComment, getComment, deleteComment, updateComment };
