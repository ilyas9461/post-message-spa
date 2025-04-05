const { ObjectId } = require('mongodb');
const MessageModel = require('../models/messages');

// After every operations, all datas will get from DB  and send frontend.
const getAllDataFromDB = async () => {
    try {
        
        const allMessages = await MessageModel.find({})
        .populate('user','first_name last_name')
        .populate({
            path: 'comments', // Populate the comments array
            options: { sort: { _id: -1 } }, //desc
            populate: {
                path: 'user', // Populate the user field inside each comment
                select: 'first_name last_name email' // Select specific fields from the user
            },
            sort:{ _id: 'desc' }
        })
        .sort({ _id: 'desc' })        
        
        if (allMessages.length === 0 || !allMessages) {
            return false
        } else return allMessages

    } catch (error) {
        return error
    }
}

const getData = async (req, res) => {
    try {
        const messages = await getAllDataFromDB()
        // console.log('allMessages:', messages)
        if (messages.length > 0)
            res.send(messages)
        else
            res.status(404).send({ message: 'No posts found' })
    } catch (error) {
        res.status(500).send({ error })
    }
}

const addPost = async (req, res) => {
    console.log('addPost:', req.body)
    
    const Message = new MessageModel(req.body)
    Message.save().then(async () => {
        const messages = await getAllDataFromDB()
        // console.log('all data after post:', messages)

        res.status(200).send(messages)
    }).catch((error) => {
        res.status(400).send(error)
    })
}

const deletePost = async (req, res) => {
    const Message = new MessageModel(req.body)
    Message.deleteOne({ _id: { $eq: req.body._id } }).then(async () => {
        const messages = await getAllDataFromDB()
        // console.log('alld data after delete:', messages);

        res.status(200).send(messages)
    }).catch(error => {
        res.status(400).send(error)
    })
}

const updatePost = async (req, res) => {
    try {
        console.log('updatePost:', req.body);
        
        const { _id, ...updateData } = req.body; // Destructure _id and other fields from the request body

        if (!_id) {
            return res.status(400).send({ error: 'Missing _id field in request body' })
        }
        // Convert _id to ObjectId
        const objectId = ObjectId.createFromHexString(_id);
        const result = await MessageModel.updateOne({ _id: objectId }, updateData)

        if (result.nModified === 0) {
            return res.status(404).send({ error: 'No document found with the provided _id' })
        }
        
        const messages = await getAllDataFromDB();
        console.log('All data after update:', messages);

        res.status(200).send(messages);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(400).send({ error: error.message });
    }
};

module.exports = {
    addPost,
    getData,
    deletePost,
    updatePost,
    getAllDataFromDB,
}