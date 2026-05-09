import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import SearchRoutesPage from "./pages/SearchRoutesPage"
import AdminPage from "./pages/AdminPage"
import BookTicketPage from "./pages/BookTicketPage"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/search" element={<SearchRoutesPage />} />

        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <BookTicketPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App