import loadCSS from '../load-css.js'
import { RegisterForm } from '../register/register-form.js'
import { LoginForm } from '../login/login.js'

loadCSS('./component/modal/modal.css')  // this path bases to server base Url. 
// The main directorry of the front-end defines app.js
// This is static files directory. In this projest is 'front-end' directory.

const Modal = (title, content) => {
    return `
    <div id="myModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <div>
                    <h2>${title}</h2>
                </div>
                <div class="close">&times;</div>
            </div>
            ${content}
        </div>

    </div>
    `
}

const showModalWith = component => {
    let modalContainer = document.querySelector('.modal-container')    
    if (modalContainer) {
        modalContainer.innerHTML = ''  // Remove before component.
    } else {
        const div = document.createElement('div') 
        div.className = 'modal-container'
        const main = document.getElementsByTagName('main')
        if (main.length > 0) {
            main[0].appendChild(div)
            modalContainer = div
            // console.log('modalContainer :', modalContainer)
        }
    }

    if (component === 'REGISTER') {
        modalContainer.innerHTML = Modal('Register Form', RegisterForm())
    }

    if (component === 'LOGIN') {
        modalContainer.innerHTML = Modal('Login', LoginForm())
    }

    const modal = document.getElementById("myModal")  // * This line have to be here. Modal have to load then btns update.
    if (modal) {
        updateModalBtns();
        modal.style.display = 'block';
    }
}

const closeModal = () => {
    const modal = document.getElementById("myModal")
    if (modal) {
        modal.style.display = "none";
    }
}

const updateModalBtns = () => {
    const closeBtn = document.querySelector('.close')
    const modal = document.getElementById("myModal");

    closeBtn.onclick = (e) => {
        closeModal()
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal()
        }
    }
}

export {
    Modal,
    updateModalBtns,
    showModalWith,
    closeModal
}
