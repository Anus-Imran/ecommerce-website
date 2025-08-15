import React, { useContext, useState, useEffect } from 'react'
import { Plus, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const ProductItem = ({ id, image, name, salePrice, actualPrice, averageRating, totalReviews, isWishlist = false }) => {
    const { currency, token, backendURL } = useContext(ShopContext)
    const [isHovered, setIsHovered] = useState(false)
    const [favourited, setFavourited] = useState(false)
    const [loading, setLoading] = useState(false)

    // Check if product is in wishlist on component mount
    useEffect(() => {
        if (token && id) {
            checkWishlistStatus()
        }
    }, [token, id])

    const checkWishlistStatus = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/wishlist/check/${id}`, {
                headers: { token }
            })
            if (response.data.success) {
                setFavourited(response.data.isInWishlist)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const toggleWishlist = async (e) => {
        e.stopPropagation()
        if (!token) {
            toast.error('Please login to add to wishlist')
            navigate('/login')
            return
        }
        
        setLoading(true)
        try {
            if (favourited) {
                // Remove from wishlist
                const response = await axios.post(`${backendURL}/api/wishlist/remove`, 
                    { productId: id }, 
                    { headers: { token } }
                )
                if (response.data.success) {
                    setFavourited(false)
                    toast.success('Removed from wishlist')
                    if (isWishlist) {
                        // Refresh wishlist page
                        window.location.reload()
                    }
                }
            } else {
                // Add to wishlist
                const response = await axios.post(`${backendURL}/api/wishlist/add`, 
                    { productId: id }, 
                    { headers: { token } }
                )
                if (response.data.success) {
                    setFavourited(true)
                    toast.success('Added to wishlist')
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="group relative bg-white rounded shadow-md transition-all duration-300 p-3 cursor-pointer flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image wrapper */}
            <div className="relative w-full aspect-square rounded-md bg-gray-100">
                <Link to={`/product/${id}`}>
                    <img
                        src={isHovered && image[1] ? image[1] : image[0]}
                        alt={name}
                        className="h-full w-full object-center object-cover transition-all duration-300"
                    />
                </Link>

                {/* Heart icon (favourite toggle) */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md z-10"
                >
                    <Heart
                        className={`w-5 h-5 transition duration-200 hover:scale-110 ${favourited ? 'text-red-500 fill-red-500' : 'text-gray-500'} ${loading ? 'opacity-50' : ''}`}
                        onClick={toggleWishlist}
                    />
                </motion.div>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-2 font-outfit">
                {/* Product Name */}
                <Link to={`/product/${id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{name}</h3>
                </Link>

                {/* Price Section */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{currency}{salePrice}</span>
                    <span className="text-sm line-through text-gray-500">{currency}{actualPrice}</span>
                </div>

                {/* Rating + Add Button */}
                <div className="flex items-center justify-between mt-2">
                    {/* Rating */}
                    <div className="flex gap-1 text-yellow-500 text-sm items-center">
                        {Array.from({ length: 5 }, (_, i) => {
                            const starValue = i + 1;
                            const starClass = starValue <= (averageRating || 0) ? 'text-yellow-500' : 'text-gray-300';
                            
                            return (
                                <span key={i} className={starClass}>
                                    ★
                                </span>
                            );
                        })}
                        <span className="text-gray-500 text-xs ml-1">({totalReviews || 0})</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductItem
