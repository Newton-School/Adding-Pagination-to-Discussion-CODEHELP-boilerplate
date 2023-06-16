const Comment = require("../models/comment.js");
const Discussion   = require("../models/discussion.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'NEWTONSCHOOL';


/*

modify getAllDiscussion

query will be of type name,heading,limit,offset.
all ready name and heading filter are added.

First Filter is done on the basis of name and heading and later on Pagination is added to the filter output.

add limit and offset filter to pipeline.
default limit if 3 and offset is 0.

/api/v1/discussion/?limit=5
will return first 5 discussions

/api/v1/discussion/?offset=2
will return first from discussions 7 to 9. (Will skip first 6 discussion)

/api/v1/discussion/?limit=5&offset=2
will return first from discussions 11 to 15. (Will skip first 10 discussion)

*/

const getAllDiscussion = async (req, res) => {
  const name = req.query.name;
  const heading = req.query.heading;
  const limit = parseInt(req.query.limit) || 3; // Default limit is 3
  const offset = parseInt(req.query.offset) || 0; // Default offset is 0

  //Modify the pipeline

  let pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "creator_id",
        foreignField: "_id",
        as: "creator"
      }
    }
  ];

  if (name) {
    pipeline.push({
      $match: {
        "creator.name": { $regex: name, $options: "i" }
      }
    });
  }

  if (heading) {
    pipeline.push({
      $match: {
        heading: { $regex: heading, $options: "i" }
      }
    });
  }

  const allDiscussion = await Discussion.aggregate(pipeline);

  res.status(200).json({
    status: "success",
    data: allDiscussion
  });
};


const createDiscussion = async (req, res) => {

    const {heading, body, token } = req.body;

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
        const newDiscussion = {
            heading,
            body,
            creator_id : decodedToken.userId
        };
        const discussion = await Discussion.create(newDiscussion);
        res.status(200).json({
            message: 'Discussion added successfully',
            discussion_id: discussion._id,
            status: 'success'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

const deleteDiscussion = async (req, res) => {

    const id = req.params.id;

    const discussion = await Discussion.findById(id);
    if(!discussion)
    {
        res.status(404).json({
            status: 'fail',
            message: "Given Discussion doesn't exist"
        })
    }

    try{
        await Discussion.findByIdAndDelete(id);
        const comments = await Comment.find({discussionId : id});
        for(let i=0;i<comments.length;i++){
            await Comment.findByIdAndDelete(comments[i]._id);
        }
        res.status(200).json({
            status: 'success',
            message: 'Discussion deleted successfully'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

const updateDiscussion = async (req, res) => {

    const id = req.params.id;

    const discussion = await Discussion.findById(id);

    if(!discussion)
    {
        res.status(404).json({
            status: 'fail',
            message: "Given Discussion doesn't exist"
        })
    }

    try{
        await Discussion.findByIdAndUpdate(id, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Discussion updated successfully'
        });
    } catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    };

}

const getDiscussion = async (req, res) => {

    const id = req.params.id;

    try{
        var discussion = await Discussion.findById(id);
        if(!discussion)
        {
            res.status(404).json({
                status: 'fail',
                message: "Given Discussion doesn't exist"
            })
        }
        const comments = await Comment.find({discussionId : id});
        discussion = discussion.toObject();
        discussion['comments'] = comments;
        res.status(200).json({
            status: 'success',
            data: discussion
        })
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: "Something went Wrong"
        })
    }

}

module.exports = { getAllDiscussion, getDiscussion, createDiscussion, deleteDiscussion, updateDiscussion };
