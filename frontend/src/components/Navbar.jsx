import { Link, useNavigate } from "react-router-dom"

function Navbar() {

    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("user"))

    const handleLogout = () => {
        localStorage.removeItem("user")
        navigate("/login")
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">

                <Link className="navbar-brand" to="/">
                    Train Ticketing
                </Link>

                <div className="navbar-nav d-flex align-items-center gap-2">

                    <Link className="nav-link" to="/">
                        Home
                    </Link>

                    <Link className="nav-link" to="/search">
                        Search Routes
                    </Link>

                    {!user && (
                        <>
                            <Link className="nav-link" to="/login">
                                Login
                            </Link>

                            <Link className="nav-link" to="/register">
                                Register
                            </Link>
                        </>
                    )}

                    {user && (
                        <>
                            <Link className="nav-link" to="/book">
                                Book Ticket
                            </Link>

                            {user.role === "ADMIN" && (
                                <Link className="nav-link" to="/admin">
                                    Admin
                                </Link>
                            )}

                            <span className="text-light ms-3">
                                {user.firstName} ({user.role})
                            </span>

                            <button
                                className="btn btn-danger btn-sm ms-2"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}

                </div>
            </div>
        </nav>
    )
}

export default Navbar