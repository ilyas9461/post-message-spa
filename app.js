require('dotenv').config()                      // for .env file.
const path = require('path')
const express = require("express")
const cookieParser = require('cookie-parser')
const router = require('./configs/routes.js')

require("./configs/mongoose.js")                // it makes a connection with mongoose in MongoDB database.

const app = express()

// app.use(express.static('front-end'));
app.use(express.static(path.join(__dirname, 'src')))

app.use(express.json())
/*  express.json():
 🔸 This middleware parses incoming JSON payloads in the request body.
 🔸 It is commonly used when your application expects JSON data from the client (e.g., in a POST or PUT request).
 🔸 After this middleware is applied, the parsed JSON data will be available in req.body.
*/
app.use(express.urlencoded({ extended: true }))
/* express.urlencoded():
 🔸This middleware parses incoming URL-encoded data (from FORMS) in the request body.
 🔸The extended: true 
        Allows parsing of nested objects in the URL-encoded data using the qs library. 
        If set to false, it uses the querystring library, which does not support nested objects.
 🔸Like the JSON middleware, the parsed data will be available in req.body.
*/
app.use(cookieParser())
app.use(router) 

// Server
const APP_PORT= process.env.PORT || 3000;
const server=app.listen(APP_PORT, () => {
    let { address, port } = server.address()
    if (address === '::') {
        address = 'localhost'
    }
    console.log(`Server is listening at http://${address}:${port}`)
});