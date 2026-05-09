import { useEffect, useState } from "react"
import api from "../services/api"

function AdminPage() {

    const [routes, setRoutes] = useState([])
    const [routeStops, setRouteStops] = useState([])
    const [selectedTrainBookings, setSelectedTrainBookings] = useState([])
    const [trains, setTrains] = useState([])
    const [stations, setStations] = useState([])

    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const [editingTrainId, setEditingTrainId] = useState(null)
    const [editingStationId, setEditingStationId] = useState(null)
    const [editingRouteId, setEditingRouteId] = useState(null)
    const [editingRouteStopId, setEditingRouteStopId] = useState(null)

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
            const routeStopsResponse = await api.get("/admin/route-stops")

            setTrains(trainsResponse.data)
            setStations(stationsResponse.data)
            setRoutes(routesResponse.data)
            setRouteStops(routeStopsResponse.data)
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

    const resetTrainForm = () => {
        setTrainForm({
            trainNumber: "",
            capacity: 0,
            delayMinutes: 0
        })
        setEditingTrainId(null)
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

            resetTrainForm()
            setSuccessMessage("Train added successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const startEditTrain = (train) => {
        clearMessages()
        setEditingTrainId(train.id)
        setTrainForm({
            trainNumber: train.trainNumber,
            capacity: train.capacity,
            delayMinutes: train.delayMinutes
        })
    }

    const updateTrain = async (e) => {
        e.preventDefault()
        clearMessages()

        try {
            await api.put(`/admin/trains/${editingTrainId}`, {
                trainNumber: trainForm.trainNumber,
                capacity: parseInt(trainForm.capacity),
                delayMinutes: parseInt(trainForm.delayMinutes)
            })

            resetTrainForm()
            setSuccessMessage("Train updated successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const deleteTrain = async (trainId) => {
        clearMessages()

        if (!window.confirm("Are you sure you want to delete this train?")) {
            return
        }

        try {
            await api.delete(`/admin/trains/${trainId}`)
            setSuccessMessage("Train deleted successfully")
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

    const startEditStation = (station) => {
        clearMessages()
        setEditingStationId(station.id)
        setStationName(station.name)
    }

    const updateStation = async (e) => {
        e.preventDefault()
        clearMessages()

        try {
            await api.put(`/admin/stations/${editingStationId}`, {
                name: stationName
            })

            setStationName("")
            setEditingStationId(null)
            setSuccessMessage("Station updated successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const deleteStation = async (stationId) => {
        clearMessages()

        if (!window.confirm("Are you sure you want to delete this station?")) {
            return
        }

        try {
            await api.delete(`/admin/stations/${stationId}`)
            setSuccessMessage("Station deleted successfully")
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

            resetRouteForm()
            setSuccessMessage("Route created successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const startEditRoute = (route) => {
        clearMessages()
        setEditingRouteId(route.id)
        setRouteForm({
            routeName: route.routeName,
            trainId: route.train?.id || "",
            startStationId: "",
            startDepartureTime: "",
            endStationId: "",
            endArrivalTime: ""
        })
    }

    const updateRoute = async (e) => {
        e.preventDefault()
        clearMessages()

        try {
            await api.put(`/admin/routes/${editingRouteId}`, {
                routeName: routeForm.routeName,
                trainId: parseInt(routeForm.trainId)
            })

            resetRouteForm()
            setSuccessMessage("Route updated successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const deleteRoute = async (routeId) => {
        clearMessages()

        if (!window.confirm("Are you sure you want to delete this route?")) {
            return
        }

        try {
            await api.delete(`/admin/routes/${routeId}`)
            setSuccessMessage("Route deleted successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const resetRouteForm = () => {
        setEditingRouteId(null)
        setRouteForm({
            routeName: "",
            trainId: "",
            startStationId: "",
            startDepartureTime: "",
            endStationId: "",
            endArrivalTime: ""
        })
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

            resetRouteStopForm()
            setSuccessMessage("Intermediate stop added successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const startEditRouteStop = (stop) => {
        clearMessages()
        setEditingRouteStopId(stop.id)
        setRouteStopForm({
            routeId: stop.route?.id || "",
            stationId: stop.station?.id || "",
            stopOrder: stop.stopOrder,
            arrivalTime: stop.arrivalTime,
            departureTime: stop.departureTime
        })
    }

    const updateRouteStop = async (e) => {
        e.preventDefault()
        clearMessages()

        try {
            await api.put(`/admin/route-stops/${editingRouteStopId}`, {
                routeId: parseInt(routeStopForm.routeId),
                stationId: parseInt(routeStopForm.stationId),
                stopOrder: parseInt(routeStopForm.stopOrder),
                arrivalTime: routeStopForm.arrivalTime,
                departureTime: routeStopForm.departureTime
            })

            resetRouteStopForm()
            setSuccessMessage("Route stop updated successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const deleteRouteStop = async (routeStopId) => {
        clearMessages()

        if (!window.confirm("Are you sure you want to delete this route stop?")) {
            return
        }

        try {
            await api.delete(`/admin/route-stops/${routeStopId}`)
            setSuccessMessage("Route stop deleted successfully")
            fetchData()
        } catch (err) {
            setErrorMessage(getErrorMessage(err))
        }
    }

    const resetRouteStopForm = () => {
        setEditingRouteStopId(null)
        setRouteStopForm({
            routeId: "",
            stationId: "",
            stopOrder: 2,
            arrivalTime: "",
            departureTime: ""
        })
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
                        <h4>{editingTrainId ? "Edit Train" : "Add Train"}</h4>

                        <form onSubmit={editingTrainId ? updateTrain : addTrain}>
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

                            <button className="btn btn-primary me-2">
                                {editingTrainId ? "Update Train" : "Add Train"}
                            </button>

                            {editingTrainId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetTrainForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="card p-4">
                        <h4>{editingStationId ? "Edit Station" : "Add Station"}</h4>
                        <p className="text-muted">
                            Coordinates are automatically detected using the station name.
                        </p>

                        <form onSubmit={editingStationId ? updateStation : addStation}>
                            <label className="form-label">Station name</label>
                            <input
                                className="form-control mb-3"
                                placeholder="Example: Oradea"
                                value={stationName}
                                onChange={(e) => setStationName(e.target.value)}
                            />

                            <button className="btn btn-success me-2">
                                {editingStationId ? "Update Station" : "Add Station"}
                            </button>

                            {editingStationId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setEditingStationId(null)
                                        setStationName("")
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="card p-4 mt-4">
                        <h4>{editingRouteId ? "Edit Route" : "Create Route"}</h4>
                        <p className="text-muted">
                            Create a route with start/final station. Editing changes only route name and train.
                        </p>

                        <form onSubmit={editingRouteId ? updateRoute : addRoute}>
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

                            {!editingRouteId && (
                                <>
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
                                </>
                            )}

                            <button className="btn btn-warning me-2">
                                {editingRouteId ? "Update Route" : "Create Route"}
                            </button>

                            {editingRouteId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetRouteForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="card p-4 mt-4">
                        <h4>{editingRouteStopId ? "Edit Route Stop" : "Add Intermediate Stop"}</h4>
                        <p className="text-muted">
                            Stop order must be between 2 and 99. Times must fit between the start and final station.
                        </p>

                        <form onSubmit={editingRouteStopId ? updateRouteStop : addRouteStop}>
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

                            <label className="form-label">Station</label>
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

                            <button className="btn btn-dark me-2">
                                {editingRouteStopId ? "Update Route Stop" : "Add Intermediate Stop"}
                            </button>

                            {editingRouteStopId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetRouteStopForm}
                                >
                                    Cancel
                                </button>
                            )}
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
                                <div>Available seats: {train.availableSeats}</div>
                                <div>Delay: {train.delayMinutes} min</div>

                                <div className="mt-2 d-flex gap-2 flex-wrap">
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

                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => startEditTrain(train)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteTrain(train.id)}
                                    >
                                        Delete
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

                                <div className="mt-2 d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => startEditStation(station)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteStation(station.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card p-4 mt-4">
                        <h4>Routes</h4>

                        {routes.map(route => (
                            <div key={route.id} className="border rounded p-2 mb-2">
                                <strong>{route.routeName}</strong>
                                <div>Train: {route.train?.trainNumber}</div>

                                <div className="mt-2 d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => startEditRoute(route)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteRoute(route.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card p-4 mt-4">
                        <h4>Route Stops</h4>

                        {routeStops.map(stop => (
                            <div key={stop.id} className="border rounded p-2 mb-2">
                                <strong>{stop.route?.routeName}</strong>
                                <div>Station: {stop.station?.name}</div>
                                <div>Order: {stop.stopOrder}</div>
                                <div>Arrival: {stop.arrivalTime}</div>
                                <div>Departure: {stop.departureTime}</div>

                                <div className="mt-2 d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => startEditRouteStop(stop)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteRouteStop(stop.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
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