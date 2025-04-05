import sendRequest from "./fetchdata.js"
import { Post, updatePostBtns } from '../component/post/post.js'

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]
const getDaySuffix = (n) => {
    if (n > 3 && n < 21) return "th"; // 11th, 12th, 13th...
    switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

const formatDateWithSuffix = (dateStr) => {
    let date = new Date(dateStr).toLocaleDateString()
    let time = ''
    let [month, day, year] = date.split("/").map(Number)
    date = new Date(year, month - 1, day) // Month is 0-based in JS 

    // Format: "Month DDth YYYY" and time
    return `${months[month - 1]} ${day}${getDaySuffix(day)} ${date.getFullYear()} ${time}`
}

const submitPost = async () => {
    const message = document.getElementById('message');
    const user = JSON.parse(localStorage.getItem("isUser")).user

    if (!message.value || message.value == '')
        return alert('Please fill in all fields!')

    const post = { message: message.value, user }

    try {
        const result = await sendRequest('/post', 'POST', post)
        // console.log('Result of submit:', result)
        if (result) {
            message.value = ''
            return result
        } else (
            console.log('No post data in DB...!')
        )
    } catch (error) {
        console.log('error:', error);
    }
}

const submitComment = async (message, index) => {
    const commentInput = document.getElementById(`comment-${index}`);
    const user = JSON.parse(localStorage.getItem('isUser')).user
    // console.log('submitComment user:', user)
    if (!commentInput.value || commentInput.value == '' || commentInput.value.length < 26)
        return alert('Please fill in comment field!')

    const comment = { 
        comment: commentInput.value, 
        user: user._id, 
        message: message._id 
    }

    try {
        const result = await sendRequest('/add-comment', 'POST', comment)
        // console.log('Result of submit comment:', result)
        if (result) {
            commentInput.value = ''
            return result
        } else (
            console.log('submitComment: No data in DB...!')
        )
    } catch (error) {
        console.log('error:', error)
    }
}

const updateContent = (data) => {
    const content = document.querySelector('.content')
    content.innerHTML = ''

    disabledMessageArea(false)
    localStorage.setItem('frontData', JSON.stringify(data))

    if (data && data.length > 0) {
        content.innerHTML = ''                      //Reset content area.
        data.forEach((post, index) => {
            content.innerHTML += Post(post, index)  // Update content area with 'Post' component and
                                                    // show post header and message in the area.
        })

        updatePostBtns(data) // update all butons with click event

        // Set all textareas to fit with their content.
        const textareas = document.querySelectorAll('.message-area')
        textareas.forEach(textarea => {
            textarea.style.height = "auto";                         // Reset height to recalculate.
            textarea.style.height = textarea.scrollHeight + "px"    // Set height to match content.
        })
    } else console.log('updateContent : No data..!')
}

const removeContent = () => {
    const content = document.querySelector('.content')
    content.innerHTML = ''
    disabledMessageArea(true)
}

const disabledMessageArea = (disabled) => {
    const textarea = document.getElementById('message')
    const btn = document.getElementById('post')

    if (disabled) {
        textarea.disabled = true
        btn.disabled = true
    } else {
        textarea.disabled = false
        btn.disabled = false
    }
}

export {
    submitPost,
    submitComment,
    formatDateWithSuffix,
    updateContent,
    removeContent,
    disabledMessageArea
}