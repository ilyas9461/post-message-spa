
const baseUrl = 'http://localhost:3000'

const sendRequest = async (endPoint, method, bodyData) => {
    const url = baseUrl + endPoint;
    const bodyOptions = method !== 'GET' ? JSON.stringify(bodyData) : null;
    // const token = JSON.parse(localStorage.getItem('isUser'))?.token;
    // the token in the cookie

    try {
        const response = await fetch(url, {
            method: method,
            credentials: 'include', // Include cookies in the request
            headers: {
                'Content-Type': 'application/json',
                // 'authorization': `Bearer ${token}`,
            },
            body: bodyOptions,
        })

        // Check if the response is not OK (e.g., 404, 500)
        if (!response.ok) {
            const errorData = await response.json(); // Parse error response           
            console.log('errorData ?', errorData );
            throw errorData
        }

        // Parse and return the response JSON
        const data = await response.json();
        return data;

    } catch (err) {
        console.error('sendRequest Error:', err);
        throw err; // Propagate the error to the caller
    }
}
export default sendRequest