import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(ShopContext)
    const location = useLocation()

    if (!token) {
        toast.error('Please login first to access this page')
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
    }

    return children
}

export default ProtectedRoute
