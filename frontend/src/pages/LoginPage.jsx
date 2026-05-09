import { useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"

function LoginPage() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post("/users/login", {
                email,
                password
            })

            localStorage.setItem("user", JSON.stringify(response.data))
            navigate("/")
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Invalid email or password"
            )
        }
    }

    return (
        <div className="container mt-5">
            <h2>Login</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin} className="w-50">
                <input
                    className="form-control mb-3"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn btn-primary" type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage