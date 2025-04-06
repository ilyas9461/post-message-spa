const UserModel = require('../models/users')
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getAllUsers = (req, res) => {

    UserModel.find({}).sort({ _id: 'desc' })
        .then(users => {
            if (users.length === 0)
                res.send('No users in DB!')
            else
                res.status(200).send(users)
        }).catch(err => {
            res.status(500).send(err)
        })
}
const handleUserErrors = (err) => {
    let errors = {}
    console.log('handleUserErrors?', err);

    // Handle duplicate error code
    if (err.code === 11000 || err.message.includes('unique')) {
        errors.email = 'That email is already registered';
        return errors;
    } else   // Handle validation errors
        if (err.message.includes('failed')) {
            Object.values(err.errors).forEach(({ properties }) => {
                errors[properties.path] = properties.message;
            })
            return errors;
        }

    return err
}

const login = async (req, res) => {
    const userEmail= req.body.email
    const userPass=req.body.password

    if (!userEmail || !userPass) {
        return res.status(400).send({ error: 'Email and password are required' });
    }
    try {
        const user = await UserModel.login(userEmail, userPass)    // the static method in the user model.
        console.log('login:', user)

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        const { password, ...userWithoutPsw } = user.toObject() //Destructuring to exclude the password.
        console.log('userWithoutPsw ?', userWithoutPsw)        

        res.cookie('token', token, { httpOnly: true })
        res.status(200).send({ user: userWithoutPsw })
    } catch (err) {
        console.error('Login error:', err.message || err); 
        const errors = handleUserErrors(err); 
        const errorMessage = errors.message || errors.email || 'An unknown error occurred'; // Extract a meaningful message
        res.status(400).send({ error: errorMessage }); // Send a structured error response
    }
}

const logout=(req, res)=>{
    res.clearCookie('token')
    res.status(200).send({ message: 'Logout successful' })
    res.end()
}

const addUser = async (req, res) => {
    const { ...user } = req.body
    console.log(user)
    // I used mongoose hook before save method in the UserSchema file.
    // Therefore I dont need bcrypt to encrypt password.
    new UserModel(user).save()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            const errors = handleUserErrors(err)
            // console.log('handleErrors:',errors)
            const errorMessage = errors || 'An error occurred while adding the user'
            res.status(500).send(errorMessage) // Send a structured error response
        })
}

const deleteUser = (req, res) => {
    const { ...user } = req.body
    console.log(user)
    UserModel.deleteOne({ _id: { $eq: user._id } }).then(resData => {
        res.status(200).send(resData)
    })
        .catch(err => res.status(500).send(err))
}

const updateUser = (req, res) => {
    const { ...user } = req.body; // Destructure _id and other fields from the request body

    if (!user._id) {
        return res.status(400).send({ error: 'Missing _id field in request body' });
    }
    const objectId = ObjectId.createFromHexString(user._id);
    UserModel.updateOne({ _id: objectId }, user).then(resData => {
        res.status(200).send(resData)

    }).catch(err => res.status(500).send(err))

}

module.exports = {
    getAllUsers,
    addUser,
    deleteUser,
    updateUser,
    login,
    logout
}