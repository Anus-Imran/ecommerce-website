import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import axios from 'axios'
import { toast } from 'react-toastify'

const Wishlist = () => {
  const { token, backendURL } = useContext(ShopContext)
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)

  const loadWishlist = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const response = await axios.get(backendURL + '/api/wishlist/get', { 
        headers: { token } 
      })
      
      if (response.data.success) {
        console.log('Wishlist data:', response.data.wishlist)
        setWishlistItems(response.data.wishlist)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWishlist()
  }, [token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={"MY"} text2={"WISHLIST"} />
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className='text-center py-20'>
          <p className='text-gray-500 text-lg'>Your wishlist is empty</p>
          <p className='text-gray-400 text-sm mt-2'>Add some products to your wishlist!</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {wishlistItems.map((item, index) => (
            <ProductItem 
              key={index} 
              id={item._id} 
              name={item.name} 
              image={item.image} 
              actualPrice={item.actualPrice} 
              salePrice={item.salePrice} 
              averageRating={item.averageRating} 
              totalReviews={item.totalReviews}
              isWishlist={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
