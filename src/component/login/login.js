import loadCSS from '../../front-utils/load-css.js'
import sendRequest from '../../front-utils/fetchdata.js'
import { closeModal } from '../modal/modal.js'
import { updateContent, disabledMessageArea, removeContent } from '../../front-utils/front-utils.js'
import {updateHeaderRight} from '../header/header.js'

loadCSS('./component/register/register.css') // this path bases to server base Url. 
// The main directorry of the front-end defines app.js
// This is static files directory. In this projest is 'front-end' directory.

const LoginForm = () => {
    return `
         <div class="container">
            <form id="loginForm">
                <input type="email" id="loginEmail" placeholder="Email" required>
                <input type="password" id="loginPassword" placeholder="Password" required>
                <button type="submit" id="login-btn">Login</button>
            </form>   
        </div>
    `
}


const loginUser = async () => {
    const form = document.getElementById('loginForm')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const userData = {
            email: form.loginEmail.value,
            password: form.loginPassword.value
        }
        // console.log(userData)
        try {
            const result = await sendRequest('/login', 'POST', userData)
            console.log('Result of login:', result)

            if (result || !result.error) {
                localStorage.setItem('isUser', JSON.stringify(result))

                window.location.href = '/'

                return result
            } else {
                console.log('User Login: No user data in DB...!')
                return
            }
        } catch (error) {
            try {
                console.log('errMessage ?', error)
                if (error.email) {
                    alert(error.email)
                } else {
                    alert(error.error)
                }
            } catch (parseError) {
                console.error('Failed to parse error message:', parseError); // Handle JSON parsing errors
                alert('An unexpected error occurred.');
            }
        }
    })
}

const logoutUser = async () => {
    try {
        const result = await sendRequest('/logout', 'GET')
        console.log('Result of logout:', result)
        if (result) {    
            localStorage.setItem('isUser', false)
            window.location.href = '/'
        }

    } catch (error) {
        console.log(error);
    }
}

export {
    LoginForm,
    loginUser,
    logoutUser
}