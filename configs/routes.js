const router = require('express').Router();
const { addPost, getData, deletePost, updatePost } = require('../controllers/message-controller');
const { getAllUsers, addUser, deleteUser,updateUser, login } = require('../controllers/user-controller')
const {addComment, delComment} =require('../controllers/comment-controler')
const verifyJWT =require('../auth/auth')

// router.get('/', (req, res) => {  // Main root
//   res.status(200).send('This is the root route!');
// });

/* Messages routes */
router.get('/data',verifyJWT, getData)       // protected  with JWT              
router.post('/post',verifyJWT, addPost)
router.delete('/delete', verifyJWT,deletePost)
router.put('/update',verifyJWT, updatePost)    

/* Users routes */
router.get('/users',verifyJWT,getAllUsers)
router.post('/login',login)                 // it is not protected with JWT. It need correct password and email.
router.post('/add-user', addUser)           // It related register or sign-up operation it is free, that way it is unprotected.
router.delete('/del-user',verifyJWT, deleteUser)
router.put('/update-user',verifyJWT, updateUser)

/* comments routes */
router.post('/add-comment', verifyJWT,addComment)
router.delete('/del-comment',verifyJWT, delComment)

module.exports = router