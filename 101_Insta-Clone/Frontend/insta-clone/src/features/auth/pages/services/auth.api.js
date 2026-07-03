// This is the API layer of React architecture.
// It is only responsible for communicating with the backend (NO UI CODE HERE).

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true, // Sends and receives cookies (JWT token)
});

// ---------------------- Register ----------------------

export async function register(username, email, password) {
    try {
        const response = await api.post("/register", {
            username,
            email,
            password,
        });

        return response.data;
    } catch (err) {
        throw err;
    }
}

// ---------------------- Login ----------------------

export async function login(username, password) {
    try {
        const response = await api.post("/login", {
            username,
            password,
        });

        return response.data;
    } catch (err) {
        throw err;
    }
}

// ---------------------- Get Current User ----------------------

export async function getMe() {
    try {
        const response = await api.get("/get-me");
        return response.data;
    } catch (err) {
        throw err;
    }
}