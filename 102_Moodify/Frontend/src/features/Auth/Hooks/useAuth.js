import { login, register, getMe, logout } from "../services/auth.api"
import { useContext } from "react"
import { AuthContext } from "../auth.context"

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    async function handleRegister({ username, email, password }) {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
        } catch (err) {
            setUser(null)
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function handleLogin({ username, email, password }) {
        setLoading(true)
        try {
            const data = await login({ username, email, password })
            setUser(data.user)
        } catch (err) {
            setUser(null)
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function handleGetMe() {
        setLoading(true)
        try {
            const data = await getMe()
            setUser(data.user)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    async function handleLogOut() {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    return ({
        user, loading, handleRegister, handleLogin, handleLogOut, handleGetMe
    })
}