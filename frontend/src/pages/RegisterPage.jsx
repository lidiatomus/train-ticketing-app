import { useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"

function RegisterPage() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "CUSTOMER"
    })

    const [error, setError] = useState("")

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            await api.post("/users/register", form)
            navigate("/login")
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Registration failed"
            )
        }
    }

    return (
        <div className="container mt-5">
            <h2>Register</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleRegister} className="w-50">
                <input
                    className="form-control mb-3"
                    name="firstName"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="lastName"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <select
                    className="form-control mb-3"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                >
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                </select>

                <button className="btn btn-success" type="submit">
                    Register
                </button>
            </form>
        </div>
    )
}

export default RegisterPage