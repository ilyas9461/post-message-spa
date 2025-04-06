import loadCSS from '../load-css.js'

loadCSS('./component/footer/footer.css')  // this path bases to server base Url. 
// The main directorry of the front-end defines app.js
// This is static files directory. In this projest is 'front-end' directory.

const footer=()=>{
    const footerElement = document.createElement('footer')
    const date = new Date().toLocaleDateString();

    const updateTime = () => {
        const now = new Date().toLocaleTimeString()      
        footerElement.innerHTML = `
          <p>Powered by lys-2025</p>
          <p>${date} <strong>${now.split(' ')[0]}</strong></p>
        `
    }

    updateTime()                 // Initial time update
    setInterval(updateTime, 1000) // Update time every second

    return footerElement
   
}

export default footer