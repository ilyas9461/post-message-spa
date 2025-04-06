const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
        maxLength: [10, 'The First Name field must be not longer than 10 characters.'],
    },
    last_name:{
        type: String,
        required: true,
        maxLength: [15, 'The Last Name field must be not longer than 15 characters.'],
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email must be unique !'],
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: [4, 'Password must be at least 4 letters.'],
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
UserSchema.pre('save', async function (next) { // function related 'this' keyword.
    // arrow function cant reach out the 'this' keyword content.
    console.log('user about to be created & saved', this)
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next()
})

// static method to login user 
UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })

    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error('incorrect password ...')  // you can catch try-catch block.
        // 
    }
    throw Error('incorrect email ...')
}


const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel 