import { useEffect, useState } from "react"
import api from "../services/api"

function BookTicketPage() {

    const [routes, setRoutes] = useState([])
    const [routeStops, setRouteStops] = useState([])

    const [form, setForm] = useState({
        routeId: "",
        departureStationId: "",
        arrivalStationId: "",
        numberOfTickets: 1
    })

    const [selectedRoute, setSelectedRoute] = useState(null)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        fetchRoutes()
    }, [])

    const getErrorMessage = (err) => {
        return (
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Operation failed"
        )
    }

    const fetchRoutes = async () => {
        try {
            const response = await api.get("/admin/routes")
            setRoutes(response.data)
        } catch (err) {
            setError(getErrorMessage(err))
        }
    }

    const handleRouteChange = async (e) => {
        const routeId = e.target.value

        setMessage("")
        setError("")

        setForm({
            routeId,
            departureStationId: "",
            arrivalStationId: "",
            numberOfTickets: form.numberOfTickets
        })

        setRouteStops([])
        setSelectedRoute(null)

        if (!routeId) {
            return
        }

        const route = routes.find(r => r.id === parseInt(routeId))
        setSelectedRoute(route)

        try {
            const response = await api.get(`/admin/routes/${routeId}/stops`)
            setRouteStops(response.data)
        } catch (err) {
            setError(getErrorMessage(err))
        }
    }

    const handleChange = (e) => {
        setMessage("")
        setError("")

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleBooking = async (e) => {
        e.preventDefault()

        setMessage("")
        setError("")

        if (!user) {
            setError("You must be logged in to book tickets")
            return
        }

        if (!selectedRoute) {
            setError("Please select a route")
            return
        }

        if (!form.departureStationId || !form.arrivalStationId) {
            setError("Please select departure and arrival stations")
            return
        }

        if (form.departureStationId === form.arrivalStationId) {
            setError("Departure and arrival stations must be different")
            return
        }

        try {
            await api.post("/bookings", {
                customerId: user.id,
                routeId: parseInt(form.routeId),
                trainId: selectedRoute.train.id,
                departureStationId: parseInt(form.departureStationId),
                arrivalStationId: parseInt(form.arrivalStationId),
                numberOfTickets: parseInt(form.numberOfTickets)
            })

            setMessage("Booking successful!")

            setForm({
                routeId: "",
                departureStationId: "",
                arrivalStationId: "",
                numberOfTickets: 1
            })

            setSelectedRoute(null)
            setRouteStops([])

        } catch (err) {
            setError(getErrorMessage(err))
        }
    }

    return (
        <div className="container mt-5">

            <h2>Book Ticket</h2>

            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleBooking} className="w-50">

                <label className="form-label">Route</label>
                <select
                    className="form-control mb-3"
                    name="routeId"
                    value={form.routeId}
                    onChange={handleRouteChange}
                >
                    <option value="">Select route</option>

                    {routes.map(route => (
                        <option key={route.id} value={route.id}>
                            {route.routeName} - Train {route.train?.trainNumber}
                        </option>
                    ))}
                </select>

                <label className="form-label">Departure station</label>
                <select
                    className="form-control mb-3"
                    name="departureStationId"
                    value={form.departureStationId}
                    onChange={handleChange}
                    disabled={!form.routeId}
                >
                    <option value="">Select departure station</option>

                    {routeStops.map(stop => (
                        <option key={stop.id} value={stop.station.id}>
                            {stop.station.name} - departure {stop.departureTime}
                        </option>
                    ))}
                </select>

                <label className="form-label">Arrival station</label>
                <select
                    className="form-control mb-3"
                    name="arrivalStationId"
                    value={form.arrivalStationId}
                    onChange={handleChange}
                    disabled={!form.routeId}
                >
                    <option value="">Select arrival station</option>

                    {routeStops.map(stop => (
                        <option key={stop.id} value={stop.station.id}>
                            {stop.station.name} - arrival {stop.arrivalTime}
                        </option>
                    ))}
                </select>

                <label className="form-label">Number of tickets</label>
                <input
                    className="form-control mb-3"
                    type="number"
                    min="1"
                    name="numberOfTickets"
                    value={form.numberOfTickets}
                    onChange={handleChange}
                />

                <button className="btn btn-success">
                    Book Ticket
                </button>

            </form>
        </div>
    )
}

export default BookTicketPage