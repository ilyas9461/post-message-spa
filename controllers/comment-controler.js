const CommentModel = require('../models/comments')
const MessageModel= require('../models/messages')
const {getAllDataFromDB} =require('./message-controller')

const addComment = (req, res) => {
    console.log('addComment:',req.body )
        
    const Comment = new CommentModel(req.body)
    Comment.save()
        .then(async (comment) => {
            // console.log('Result of save comment: ', comment)
            MessageModel.findById(req.body.message)
                .then((messageInfo) => {
                    if (!messageInfo) {
                        return res.status(404).send({ error: 'Message not found' })
                    }
                    // console.log('Message info:', messageInfo);
                    messageInfo.comments.push(comment._id)
                    messageInfo.save()
                        .then(async (info) => {
                            console.log('Updated message info:', info)
                            const allData= await getAllDataFromDB()
                            res.status(200).send(allData)
                        })
                        .catch((err) => {
                            console.error('Error saving message:', err)
                            res.status(500).send({ error: 'Failed to save message' })
                        })
                })
                .catch((err) => {
                    console.error('Error finding message:', err);
                    res.status(500).send({ error: 'Failed to find message' })
                });
        })
        .catch((error) => {
            console.error('Error saving comment:', error);
            res.status(400).send({ error: 'Failed to save comment' })
        })
};

const delComment = async (req, res) => {
    try {
        const { _id, message } = req.body      

        if (!_id || !message) {
            return res.status(400).send({ error: 'Comment ID and Message ID are required' })
        }

        const deletedComment = await CommentModel.findByIdAndDelete(_id)
        if (!deletedComment) {
            return res.status(404).send({ error: 'Comment not found' })
        }
        // console.log('Deleted comment:', deletedComment);

        const messageInfo = await MessageModel.findById(message)
        if (!messageInfo) {
            return res.status(404).send({ error: 'Message not found' })
        }

        messageInfo.comments = messageInfo.comments.filter(commentId => commentId.toString() !== _id)
        await messageInfo.save()
        // console.log('Updated message after comment deletion:', messageInfo);

        const allData = await getAllDataFromDB()
        res.status(200).send(allData);

    } catch (error) {
        console.error('Error deleting comment:', error)
        res.status(500).send({ error: 'Failed to delete comment' })
    }
};

module.exports={
    addComment,
    delComment
}