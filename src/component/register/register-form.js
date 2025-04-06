import loadCSS from '../../front-utils/load-css.js'
import sendRequest from '../../front-utils/fetchdata.js'
import { closeModal } from '../modal/modal.js'

loadCSS('./component/register/register.css') // this path bases to server base Url. 
// The main directorry of the front-end defines app.js
// This is static files directory. In this projest is 'front-end' directory.

const RegisterForm = () => {
    return `
         <div class="container">
                <form id="registerForm">
                    <input type="text" id="firstname" placeholder="First name" required>
                    <input type="text" id="lastname" placeholder="Last name" required>
                    <input type="email" id="email" placeholder="Email" required>
                    <input type="password" id="password" placeholder="Password" required>
                    <button type="submit">Submit</button>
                </form>
            </div>
    `
}

const submitUser = async () => {
    const form = document.getElementById('registerForm')
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const userData = {
            first_name: form.firstname.value,
            last_name: form.lastname.value,
            email: form.email.value,
            password: form.password.value
        }
        console.log('submitUser:', userData)
        if (!userData.first_name || userData.first_name === '' ||
            !userData.last_name || userData.last_name === '' ||
            !userData.email || userData.email === '' ||
            !userData.password || userData.password === ''
        )
            return alert('Please fill in all fields!');

        try {
            const result = await sendRequest('/add-user', 'POST', userData)
            console.log('Result of submit:', result)

            if (result && !result.error) {
                alert("User save in the DB...!")
                closeModal()
                return result
            } else {
                // alert('error:', result)
            }

        } catch (error) {
            console.log(error.message) //  Error: {"email":"That email is already registered"}
            try {
                // const errMessage = JSON.parse(error.message);
                let msg=''
                if (error.message.email) {
                    alert(errMessage.email)
                }else{
                    for (const [key, value] of Object.entries(errMessage)) {
                        msg+=`${value} \r`
                        // alert(`${key}: ${value}`); // Display each key-value pair in an alert
                    }
                    alert('Error: \r'+ msg)
                }
               
            } catch (parseError) {
                console.error('Failed to parse error message:', parseError); // Handle JSON parsing errors
                alert('An unexpected error occurred');
            }        

        }
    })
}

export {
    RegisterForm,
    submitUser
} 