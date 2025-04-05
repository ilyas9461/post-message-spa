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

const login = async (req, res) => {

    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send({ error: 'Email and password are required' });
    }

    UserModel.findOne({ email: email })
        .then(async users => {
            if (!users) {
                const err = { error: 'User not found or invalid credentials' }
                console.error('Error finding user:', err);
                return res.status(404).send(err);
            }

            if (users.length > 0) {
                for (const user of user) {
                    const isPasswordValid = await bcrypt.compare(password, user.password)
                    if (isPasswordValid) {
                        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' })
                        const { password, ...userWithoutPsw } = user.toObject()
                        return res.send({
                            user: userWithoutPsw,
                            token
                        })
                    }
                }
            } else {
                const isPasswordValid = await bcrypt.compare(password, users.password)
                if (isPasswordValid) {
                    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' })
                    const { password, ...userWithoutPsw } = users.toObject();
                    return res.send({
                        user: userWithoutPsw,
                        token
                    })
                }
            }

            res.status(401).send({ message: 'Invalid username or password' });
        })
        .catch(err => {
            console.error('Error finding user:', err);
            res.status(400).send(err);
        });
}

const addUser = async (req, res) => {
    const { ...user } = req.body
    console.log(user)
    user.password = await bcrypt.hash(user.password, 10)

    new UserModel(user).save()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send(err)
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
    login
}