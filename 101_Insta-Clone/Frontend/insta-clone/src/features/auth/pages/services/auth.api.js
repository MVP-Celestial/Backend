//this is the api layer of react architecture only for communication with the backend (NO UI CODE HERE)

import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})


export async function register(username,email,password) {
    try {
        const response = await api.post("/register", {
            username,
            email,
            password,
        })

        return response.data
    }
    catch(err){
        throw err
    }
}

export async function login(email, password) {
    try{
        const response = await api.post("/login", {
            username,
            password
        })

        return response.data


    }
    catch(err) {
        throw err
    }
}

export async function getMe() {
    try{
        const response = await api.get("/get-me")
        return response.data
    }
    catch(err) {
        throw err
    }
}