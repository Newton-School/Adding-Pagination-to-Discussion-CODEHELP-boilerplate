const Question   = require("../models/question.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'NEWTONSCHOOL';

const createQuestion = async (req, res) => {

    const { questionName, topic, rating, link, status, token } = req.body;
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
        const newQuestion = {
            questionName,
            topic,
            rating,
            link,
            status,
            creatorId: decodedToken.userId,
        };
        const question = await Question.create(newQuestion);
        res.status(200).json({
        message: 'Question added successfully to questionBank',
            questionId: question._id,
            status: 'success'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

const getQuestion = async (req, res) => {

    const token = req.body.token;
    const {topic, status, range} = req.query;
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
        let lowerLimit = 0, upperLimit = 11;
        try{
            [ lowerLimit, upperLimit]  = range.split("-");
            if(!upperLimit) upperLimit = 11;
        }catch(err){};
        const questions = await Question.find( {
            creatorId : decodedToken.userId, 
            $or: [
                { status: { $exists: false } },
                { status: { $regex: new RegExp(status, "i") } }
                ],
            topic: { $regex: new RegExp(topic, "i") } ,
            rating: { $gte: lowerLimit, $lte: upperLimit }
        } );
        res.status(200).json({
            questions,
            status: 'success'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

const deleteQuestion = async (req, res) => {

    try{
        const questiontId = req.params.id;
        const question = await Question.findById(questiontId);
        if(!question)
        {
            res.status(404).json({
                status: 'fail',
                message: "Given Question doesn't exist"
            })
        }
        await Question.findByIdAndDelete(questiontId);
        res.status(200).json({
            status: 'success',
            message: 'Question deleted successfully'
        })
        
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

const updateQuestion = async (req, res) => {

    const questiontId = req.params.id;
    const { questionName, topic, rating, link, status, token } = req.body;

    try{
        const question = await Question.findById(questiontId);
        if(!question)
        {
            res.status(404).json({
                status: 'fail',
                message: "Given Question doesn't exist"
            })
        }
        const obj = {};
        if(questionName) obj['questionName'] = questionName;
        if(topic) obj['topic'] = topic;
        if(rating) obj['rating'] = rating;
        if(link) obj['link'] = link;
        if(status) obj['status'] = status;

        await Question.findByIdAndUpdate(questiontId, obj);
        res.status(200).json({
            status: 'success',
            message: 'Question updated successfully'
        });
    } catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    };

}

module.exports = { createQuestion, getQuestion, deleteQuestion, updateQuestion };
