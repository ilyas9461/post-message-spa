import sendRequest from "../../front-utils/fetchdata.js"
import { updateContent } from '../../front-utils/front-utils.js'

const Comment=(comments,index)=>{
    let html=''
    comments.forEach((item,i) => {
        // console.log('item:', item)        
        html+= `
        <div class="post-comment-area">          
          <li><span>@${item.user.first_name} </span> ${item.comment}</li>
          <button class="comment-del" data-index="${index}"  data-item="${i}"> ❌ </button>  
        </div> 
    `
    })
    return html
}

const updateCommentBtns=(posts)=>{
    const commentBtns=document.querySelectorAll('.comment-del')
    // console.log('commentBtns :', posts);    
    commentBtns.forEach(btn=>{
        btn.addEventListener('click', async e=>{
            const commentIndex = e.target.getAttribute('data-item')
            const postIndex = e.target.getAttribute('data-index')
            // console.log('comment btn index:', posts[postIndex].comments[commentIndex])
            const commentData={
                _id:posts[postIndex].comments[commentIndex]._id,
                message:posts[postIndex]._id,
            }
            const ans=prompt('If you want to delete, write "Yes" !')
            if(ans==="Yes"){
                const result= await sendRequest('/del-comment','DELETE', commentData)
                if(result.length>0){
                    updateContent(result)
                }else console.log("delComment: No data in DB !")       
            }
        })
    })
}

export {
    Comment,
    updateCommentBtns,
}