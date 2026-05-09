import { useState } from "react"
import api from "../services/api"

function SearchRoutesPage() {
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [routes, setRoutes] = useState([])
    const [error, setError] = useState("")

    const handleSearch = async (e) => {
        e.preventDefault()
        setError("")
        setRoutes([])

        try {
            const response = await api.get("/routes/search", {
                params: {
                    from,
                    to
                }
            })

            setRoutes(response.data)
        } catch (err) {
            setError("Could not search routes")
        }
    }

    return (
        <div className="container mt-5">
            <h2>Search Routes</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSearch} className="w-50 mb-4">
                <input
                    className="form-control mb-3"
                    placeholder="From station"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                />

                <input
                    className="form-control mb-3"
                    placeholder="To station"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                />

                <button className="btn btn-primary" type="submit">
                    Search
                </button>
            </form>

            {routes.length > 0 && (
                <div>
                    <h4>Results</h4>

                    {routes.map((route, index) => (
                        <div key={index} className="alert alert-info">
                            {route}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchRoutesPage