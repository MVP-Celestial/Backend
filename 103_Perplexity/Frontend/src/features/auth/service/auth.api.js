import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true, // Include cookies in requests
})

export async function register({email, username, password}) {

    const response = await api.post('/api/auth/register', { email, username, password })
    return response.data
}

export async function login({email, password}) {
    const response = await api.post('/api/auth/login', {email, password})
    return response.data
}

export async function getMe() {

    const response = await api.get('/api/auth/me')
    return response.data
}

//auth.api.js is the service layer that handles API calls related to authentication. It uses axios to make HTTP requests to the backend server. The functions register, login, and getMe are exported for use in other parts of the frontend application, allowing components to interact with the authentication endpoints of the backend.