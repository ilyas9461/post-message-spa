import sendRequest from "./front-utils/fetchdata.js"
import { submitPost,updateContent,disabledMessageArea } from './front-utils/front-utils.js'
import {Header, updateHeaderBtns} from './component/header/header.js'
import Footer from './component/footer/footer.js'


//initialize home page components
const main= document.getElementsByTagName('main')
if(main.length>0) {
    main[0].innerHTML = Header()+ main[0].innerHTML
    main[0].appendChild(Footer())
    updateHeaderBtns()
}
// then select menu and post btns
const postBtn = document.getElementById('post') 


localStorage.setItem('frontData',[])

disabledMessageArea(true)

postBtn.onclick = ('submit', async (e) => {
    e.preventDefault()
    const data = await submitPost()
    updateContent(data)
})

const isUser=JSON.parse(localStorage.getItem('isUser'))
// if close the browser and reopen browser than you can get the user data 
// if your session is not over.
if(isUser.user){
    console.log('isUser',JSON.parse(localStorage.getItem('isUser')))

    const logoutBtn = document.querySelector('.logout')
    logoutBtn.textContent=isUser.user.first_name+'-Logout'

    sendRequest('/data', 'GET', '').then(data => {
        if (data.message) {
            console.log(data.message)
            return;
        }
        updateContent(data)
    }).catch(err => console.log(err));
}

