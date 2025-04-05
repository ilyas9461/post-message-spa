const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        // minLength: 6
    }
},
    {
        timestamps: true
    }
)

// These call Mongoose hooks
// fire a function after doc saved to db 
// UserSchema.post('save', function (doc, next) {
//     console.log('new user was created & saved', doc);
//     next();
// })

// fire a function before doc saved to db 
// UserSchema.pre('save', async function (next) { // function related 'this' keyword.
//                                                // arrow function cant reach out the 'this' keyword content.
//     console.log('user about to be created & saved', this)
//     const salt = await bcrypt.genSalt(); 
//     this.password = await bcrypt.hash(this.password, salt);  
//     next()
// })

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel 