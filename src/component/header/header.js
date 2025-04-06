import { showModalWith } from "../modal/modal.js"
import { submitUser } from '../register/register-form.js'
import { loginUser, logoutUser } from "../login/login.js"

const Menu = () => {
    const isUser = JSON.parse(localStorage.getItem('isUser'))
    if (isUser) {
        return `
             <div class="header-right">
                <a class="logout">| Logout |</a>
            </div>
        `
    } else {
        return `
            <div class="header-right">
                <a class="login">| Login | </a>
                <a class="register">Register |</a>
            </div>
        `
    }
}

const Header = () => {
    return `
        <div class="header-title">
            <div class="header-left">
                <h3>The Timeline Comments</h3>
            </div>
           ${Menu()}
        </div>
        <div class="form">
            <form>
                <div class="post-message">
                    <label for="message">Post a message </label>
                    <textarea name="message" id="message"></textarea>
                    <button id="post">Post Message</button>
                </div>       
            </form>
        </div>
    `
}

const updateHeaderBtns = () => {
    const registerBtn = document.querySelector('.register')
    const loginBtn = document.querySelector('.login')
    const logoutBtn = document.querySelector('.logout')

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            console.log(logoutBtn);
            logoutUser()
        }
    }

    if (registerBtn) {
        registerBtn.onclick = e => {
            showModalWith('REGISTER')
            submitUser()
        }
    }

    if (loginBtn) {
        loginBtn.onclick = e => {
            showModalWith('LOGIN')
            loginUser()
        }
    }
}

const updateHeaderRight = (user)=>{
    const headerRight=document.querySelector('.header-right')     
    
    if(user){
        headerRight.innerHTML=` <a class="logout">| Logout |</a>`
    }else{
        headerRight.innerHTML=`
             <a class="login">| Login | </a>
             <a class="register">Register |</a>
        `
    }
    updateHeaderBtns()
                
}
export {
    Header,
    updateHeaderBtns,
    updateHeaderRight 
}

