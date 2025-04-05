const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        minlength: [25, 'Comment must be at least 25 characters long.'],
        required: true
    },
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    message:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages',
    },

},
{ timestamps: true })

const CommentModel = mongoose.model("comments", CommentSchema)
                                // (CollectionName, Schema)
// 'comments' is the collection or document name, DB name is in the connection URL in the .env file.
//    | -DB NAME (matrix-master)
//       [Collection or Document Name] 
//    |   - messages
//    |   - users
//    |   - comments
module.exports = CommentModel