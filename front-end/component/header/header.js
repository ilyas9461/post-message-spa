const header=()=>{
    return `
        <div class="header-title">
            <div class="header-left">
                <h3>The Timeline Comments</h3>
            </div>
            <div class="header-right">
                <a class="login">Login |</a>
                <a class="register">Register |</a>
                <a class="logout">Logout</a>
            </div>
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

export default header

