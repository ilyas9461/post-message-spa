import { formatDateWithSuffix, updateContent, submitComment } from '../../front-utils/front-utils.js'
import sendRequest from "../../front-utils/fetchdata.js"
import { Comment, updateCommentBtns } from '../comment/comment.js'

const Post = (post, index) => {
    return `
    <div class="posts">
        <div class="post-header">
          <h4>${index + 1} - ${post.user?.first_name ? post.user?.first_name : ''}  ${formatDateWithSuffix(post.createdAt)}</h4>
          <div class="post-btns">
            <button class="del-btn" data-index="${index}">❌</button>
            <button class="edit-btn" data-index="${index}">✏️</button>
          </div>
        </div>       
        <textarea class="message-area" type="text" name="edit-text" id="edit-text-${index}" 
         value="${post.message}" disabled />${post.message}</textarea>   
        <div class="post-comment">
          <textarea name="comment" id="comment-${index}"></textarea>
          <div class="post-comment-len">
            <span id="comment-length-${index}"></span>
            <button class="post-comment-btn" data-index="${index}" >Post Comment</button>
          </div>
        </div>  
        ${Comment(post.comments, index)} 
    </div>
    `
}

let clickEventTracker = ''  // This variable store which element clicked in the 'Post' component.

const deleteBtnsUpdate = (deleteButtons) => {
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const dataIndex = e.target.getAttribute('data-index')     

            const ans = prompt('If you want to delete this post, you must write "Yes" in the promt!')
            if (ans === 'Yes') {
                const frontData=JSON.parse(localStorage.getItem('frontData'))[dataIndex]
                // console.log('frontData:',frontData)                
                sendRequest('/delete', 'DELETE', frontData)
                    .then(data => {
                        console.log('Delete:', data)
                        updateContent(data)
                    })
            }
        })
    })
}

const editBtnsUpdate = (editButtons) => {
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const dataIndex = e.target.getAttribute('data-index')
            const clickedInputId = `edit-text-${dataIndex}`
            const editInput = document.getElementById(clickedInputId)
            console.log(`Edit button clicked for index: ${dataIndex}`)

            // If you click on the 'Edit' button, it will replace the text with 'Save'. 
            // After clicking the button again, the message will be updated and the button will be reset.
            if (clickEventTracker != clickedInputId && clickEventTracker === '') {
                e.target.textContent = 'Save'
                editInput.disabled = false
                clickEventTracker = clickedInputId
            } else if (clickEventTracker === clickedInputId) {
                e.target.textContent = 'Edit'
                editInput.disabled = true
                clickEventTracker = ''          // reset variable

                const frontData=JSON.parse(localStorage.getItem('frontData'))[dataIndex] 
                frontData.message = editInput.value
                // console.log('Edit :' ,frontData)                
                sendRequest('/update', 'PUT', frontData)
                    .then(data => {
                        console.log('Update:', data)
                        updateContent(data)
                    })
            }
        });
    });
}
const postAreasUpdate = (postAreas) => {
    postAreas.forEach(postArea => {
        postArea.addEventListener('click', (e) => {
            /* console.log(e.target.classList)
               const postElement = e.target.closest('.posts') // It reach out to posts area in html.
               const editInput = postElement.querySelector(`#${clickEventTracker}`) // to get element from postElement.
             */

            // Check textarea or edit button          
            if ((e.target.tagName.toLowerCase() === 'textarea') ||
                e.target.classList.contains('edit-btn')) {
                return
            }

            // If click wherever in the post area (except textarea and edit button) the update will cancel.
            if (clickEventTracker !== '') {
                                                                                         // get index from variable
                const clickedEditBtn = document.querySelector(`.edit-btn[data-index="${clickEventTracker.split('-')[2]}"]`);
                clickedEditBtn.textContent = 'Edit';
                const editInput = document.getElementById(clickEventTracker);
                editInput.disabled = true;
                clickEventTracker = '';
            }
        })
    })
}

const updatePostConmmentBtns = (btns, index) => {
    btns.forEach((btn, index) => {
        btn.addEventListener('click', async e => {
            const dataIndex = e.target.getAttribute('data-index');
            // console.log('dataIndex:',dataIndex)
            const frontData=JSON.parse(localStorage.getItem('frontData'))[dataIndex]
            // console.log('Update frontData' , frontData)            
            const data = await submitComment(frontData, index) 

            if (Array.isArray(data)) // is it's not array, it is error message.
                updateContent(data)
        })
        // when on mouseover on the post comment button then show comment length to left side the button.
        btn.addEventListener('mouseover', (e) => {
            const commentInput = document.getElementById(`comment-${index}`)
            const commentLen = document.getElementById(`comment-length-${index}`)

            if (commentInput.value.length <= 25)
                commentLen.textContent = commentInput.value.length + ' < 25'
            else
                commentLen.textContent = ''
        })
    })

}
const updatePostBtns = (posts) => {
    const deleteButtons = document.querySelectorAll('.del-btn');
    const editButtons = document.querySelectorAll('.edit-btn');
    const postAreas = document.querySelectorAll('.posts')
    const postCommentsBtns = document.querySelectorAll('.post-comment-btn')

    deleteBtnsUpdate(deleteButtons)
    editBtnsUpdate(editButtons)
    postAreasUpdate(postAreas)
    updatePostConmmentBtns(postCommentsBtns)
    updateCommentBtns(posts)
}

export {
    Post,
    updatePostBtns,
}