import { useEffect, useState } from "react"
import api from "../services/api"

function AdminPage() {

    const [routes, setRoutes] = useState([])
    const [selectedTrainBookings, setSelectedTrainBookings] = useState([])
    const [trains, setTrains] = useState([])
    const [stations, setStations] = useState([])

    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const [routeForm, setRouteForm] = useState({
        routeName: "",
        trainId: "",
        startStationId: "",
        startDepartureTime: "",
        endStationId: "",
        endArrivalTime: ""
    })

    const [routeStopForm, setRouteStopForm] = useState({
        routeId: "",
        stationId: "",
        stopOrder: 2,
        arrivalTime: "",
        departureTime: ""
    })

    const [trainForm, setTrainForm] = useState({
        trainNumber: "",
        capacity: 0,
        delayMinutes: 0
    })

    const [stationName, setStationName] = useState("")

    useEffect(() => {
        fetchData()
    }, [])

    const clearMessages = () => {
        setSuccessMessage("")
        setErrorMessage("")
    }

    const getErrorMessage = (err) => {
        return (
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Operation failed"
        )
    }

    const fetchData = async () => {
        try {
            const trainsResponse = await api.get("/admin/trains")
            const stationsResponse = await api.get("/admin/stations")
            const routesResponse = await api.get("/admin/routes")

            setTrains(trainsResponse.data)
            setStations(stationsResponse.data)
            setRoutes(routesResponse.data)
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const handleTrainChange = (e) => {
        setTrainForm({
            ...trainForm,
            [e.target.name]: e.target.value
        })
    }

    const addTrain = async (e) => {
        e.preventDefault()
        clearMessages()

        try {
            await api.post("/admin/trains", {
                trainNumber: trainForm.trainNumber,
                capacity: parseInt(trainForm.capacity),
                delayMinutes: parseInt(trainForm.delayMinutes)
            })

            setTrainForm({
                trainNumber: "",
                capacity: 0,
                delayMinutes: 0
            })

            setSuccessMessage("Train added successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const addStation = async (e) => {
        e.preventDefault()
        clearMessages()

        try {
            await api.post("/admin/stations", {
                name: stationName
            })

            setStationName("")
            setSuccessMessage("Station added successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const addRoute = async (e) => {
        e.preventDefault()
        clearMessages()

        try {
            await api.post("/admin/routes", {
                routeName: routeForm.routeName,
                trainId: parseInt(routeForm.trainId),
                startStationId: parseInt(routeForm.startStationId),
                startDepartureTime: routeForm.startDepartureTime,
                endStationId: parseInt(routeForm.endStationId),
                endArrivalTime: routeForm.endArrivalTime
            })

            setRouteForm({
                routeName: "",
                trainId: "",
                startStationId: "",
                startDepartureTime: "",
                endStationId: "",
                endArrivalTime: ""
            })

            setSuccessMessage("Route created successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const addRouteStop = async (e) => {
        e.preventDefault()
        clearMessages()

        try {
            await api.post("/admin/route-stops", {
                routeId: parseInt(routeStopForm.routeId),
                stationId: parseInt(routeStopForm.stationId),
                stopOrder: parseInt(routeStopForm.stopOrder),
                arrivalTime: routeStopForm.arrivalTime,
                departureTime: routeStopForm.departureTime
            })

            setRouteStopForm({
                routeId: "",
                stationId: "",
                stopOrder: 2,
                arrivalTime: "",
                departureTime: ""
            })

            setSuccessMessage("Intermediate stop added successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const setDelay = async (trainId) => {
        clearMessages()

        const delay = prompt("Enter delay minutes")
        if (!delay) return

        try {
            await api.post(`/admin/trains/${trainId}/delay`, {
                delayMinutes: parseInt(delay)
            })

            setSuccessMessage("Delay updated successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const loadBookings = async (trainId) => {
        clearMessages()

        try {
            const response = await api.get(`/admin/trains/${trainId}/bookings`)
            setSelectedTrainBookings(response.data)
            setSuccessMessage("Bookings loaded successfully")
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    return (
        <div className="container mt-5">

            <h2 className="mb-4">Admin Dashboard</h2>

            {successMessage && (
                <div className="alert alert-success">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            )}

            <div className="row">

                <div className="col-md-6">

                    <div className="card p-4 mb-4">
                        <h4>Add Train</h4>

                        <form onSubmit={addTrain}>
                            <label className="form-label">Train number</label>
                            <input
                                className="form-control mb-3"
                                placeholder="Example: IR100"
                                name="trainNumber"
                                value={trainForm.trainNumber}
                                onChange={handleTrainChange}
                            />

                            <label className="form-label">Train capacity</label>
                            <input
                                className="form-control mb-3"
                                type="number"
                                placeholder="Example: 100"
                                name="capacity"
                                value={trainForm.capacity}
                                onChange={handleTrainChange}
                            />

                            <label className="form-label">Delay in minutes</label>
                            <input
                                className="form-control mb-3"
                                type="number"
                                placeholder="Example: 0"
                                name="delayMinutes"
                                value={trainForm.delayMinutes}
                                onChange={handleTrainChange}
                            />

                            <button className="btn btn-primary">
                                Add Train
                            </button>
                        </form>
                    </div>

                    <div className="card p-4">
                        <h4>Add Station</h4>
                        <p className="text-muted">
                            Coordinates are automatically detected using the station name.
                        </p>

                        <form onSubmit={addStation}>
                            <label className="form-label">Station name</label>
                            <input
                                className="form-control mb-3"
                                placeholder="Example: Oradea"
                                value={stationName}
                                onChange={(e) => setStationName(e.target.value)}
                            />

                            <button className="btn btn-success">
                                Add Station
                            </button>
                        </form>
                    </div>

                    <div className="card p-4 mt-4">
                        <h4>Create Route</h4>
                        <p className="text-muted">
                            Create a route by choosing its train, start station and final station.
                        </p>

                        <form onSubmit={addRoute}>
                            <label className="form-label">Route name</label>
                            <input
                                className="form-control mb-3"
                                placeholder="Example: Cluj - Bucharest"
                                value={routeForm.routeName}
                                onChange={(e) =>
                                    setRouteForm({
                                        ...routeForm,
                                        routeName: e.target.value
                                    })
                                }
                            />

                            <label className="form-label">Train assigned to this route</label>
                            <select
                                className="form-control mb-3"
                                value={routeForm.trainId}
                                onChange={(e) =>
                                    setRouteForm({
                                        ...routeForm,
                                        trainId: e.target.value
                                    })
                                }
                            >
                                <option value="">Select train</option>

                                {trains.map(train => (
                                    <option key={train.id} value={train.id}>
                                        {train.trainNumber}
                                    </option>
                                ))}
                            </select>

                            <label className="form-label">Start station</label>
                            <select
                                className="form-control mb-3"
                                value={routeForm.startStationId}
                                onChange={(e) =>
                                    setRouteForm({
                                        ...routeForm,
                                        startStationId: e.target.value
                                    })
                                }
                            >
                                <option value="">Select start station</option>

                                {stations.map(station => (
                                    <option key={station.id} value={station.id}>
                                        {station.name}
                                    </option>
                                ))}
                            </select>

                            <label className="form-label">Departure time from start station</label>
                            <input
                                className="form-control mb-3"
                                type="time"
                                value={routeForm.startDepartureTime}
                                onChange={(e) =>
                                    setRouteForm({
                                        ...routeForm,
                                        startDepartureTime: e.target.value
                                    })
                                }
                            />

                            <label className="form-label">Final station</label>
                            <select
                                className="form-control mb-3"
                                value={routeForm.endStationId}
                                onChange={(e) =>
                                    setRouteForm({
                                        ...routeForm,
                                        endStationId: e.target.value
                                    })
                                }
                            >
                                <option value="">Select final station</option>

                                {stations.map(station => (
                                    <option key={station.id} value={station.id}>
                                        {station.name}
                                    </option>
                                ))}
                            </select>

                            <label className="form-label">Arrival time at final station</label>
                            <input
                                className="form-control mb-3"
                                type="time"
                                value={routeForm.endArrivalTime}
                                onChange={(e) =>
                                    setRouteForm({
                                        ...routeForm,
                                        endArrivalTime: e.target.value
                                    })
                                }
                            />

                            <button className="btn btn-warning">
                                Create Route
                            </button>
                        </form>
                    </div>

                    <div className="card p-4 mt-4">
                        <h4>Add Intermediate Stop</h4>
                        <p className="text-muted">
                            Stop order must be between 2 and 99. Times must fit between the start and final station.
                        </p>

                        <form onSubmit={addRouteStop}>
                            <label className="form-label">Route where the stop will be added</label>
                            <select
                                className="form-control mb-3"
                                value={routeStopForm.routeId}
                                onChange={(e) =>
                                    setRouteStopForm({
                                        ...routeStopForm,
                                        routeId: e.target.value
                                    })
                                }
                            >
                                <option value="">Select route</option>

                                {routes.map(route => (
                                    <option key={route.id} value={route.id}>
                                        {route.routeName}
                                    </option>
                                ))}
                            </select>

                            <label className="form-label">Intermediate station</label>
                            <select
                                className="form-control mb-3"
                                value={routeStopForm.stationId}
                                onChange={(e) =>
                                    setRouteStopForm({
                                        ...routeStopForm,
                                        stationId: e.target.value
                                    })
                                }
                            >
                                <option value="">Select station</option>

                                {stations.map(station => (
                                    <option key={station.id} value={station.id}>
                                        {station.name}
                                    </option>
                                ))}
                            </select>

                            <label className="form-label">Stop order</label>
                            <input
                                className="form-control mb-3"
                                type="number"
                                min="2"
                                max="99"
                                placeholder="Example: 2"
                                value={routeStopForm.stopOrder}
                                onChange={(e) =>
                                    setRouteStopForm({
                                        ...routeStopForm,
                                        stopOrder: e.target.value
                                    })
                                }
                            />

                            <label className="form-label">Arrival time at this station</label>
                            <input
                                className="form-control mb-3"
                                type="time"
                                value={routeStopForm.arrivalTime}
                                onChange={(e) =>
                                    setRouteStopForm({
                                        ...routeStopForm,
                                        arrivalTime: e.target.value
                                    })
                                }
                            />

                            <label className="form-label">Departure time from this station</label>
                            <input
                                className="form-control mb-3"
                                type="time"
                                value={routeStopForm.departureTime}
                                onChange={(e) =>
                                    setRouteStopForm({
                                        ...routeStopForm,
                                        departureTime: e.target.value
                                    })
                                }
                            />

                            <button className="btn btn-dark">
                                Add Intermediate Stop
                            </button>
                        </form>
                    </div>

                </div>

                <div className="col-md-6">

                    <div className="card p-4 mb-4">
                        <h4>Trains</h4>

                        {trains.map(train => (
                            <div key={train.id} className="border rounded p-2 mb-2">
                                <strong>{train.trainNumber}</strong>
                                <div>Capacity: {train.capacity}</div>
                                <div>Capacity: {train.capacity}</div>
                                <div>Delay: {train.delayMinutes} min</div>

                                <div className="mt-2 d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-warning"
                                        onClick={() => setDelay(train.id)}
                                    >
                                        Set Delay
                                    </button>

                                    <button
                                        className="btn btn-sm btn-info"
                                        onClick={() => loadBookings(train.id)}
                                    >
                                        View Bookings
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card p-4">
                        <h4>Stations</h4>

                        {stations.map(station => (
                            <div key={station.id} className="border rounded p-2 mb-2">
                                <strong>{station.name}</strong>

                                {station.latitude && station.longitude && (
                                    <div className="text-muted small">
                                        Lat: {station.latitude}, Lon: {station.longitude}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="card p-4 mt-4">
                        <h4>Routes</h4>

                        {routes.map(route => (
                            <div key={route.id} className="border rounded p-2 mb-2">
                                <strong>{route.routeName}</strong>
                                <div>Train: {route.train?.trainNumber}</div>
                            </div>
                        ))}
                    </div>

                    <div className="card p-4 mt-4">
                        <h4>Bookings</h4>

                        {selectedTrainBookings.length === 0 && (
                            <p className="text-muted">
                                No bookings selected.
                            </p>
                        )}

                        {selectedTrainBookings.map(booking => (
                            <div key={booking.id} className="border rounded p-2 mb-2">
                                <div>Customer: {booking.customer.firstName}</div>
                                <div>Tickets: {booking.numberOfTickets}</div>
                                <div>From: {booking.departureStation.name}</div>
                                <div>To: {booking.arrivalStation.name}</div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </div>
    )
}

export default AdminPage