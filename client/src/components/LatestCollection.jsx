import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {

    const { products, productsLoading } = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0, 10));
    }, [products])

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'LATEST'} text2={'COLLECTIONS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md-text-base text-gray-600'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.
                </p>
            </div>

            {/* Rendering products  */}

            {productsLoading ? (
                <div className='flex justify-center items-center py-20'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {latestProducts.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            salePrice={item.salePrice}
                            actualPrice={item.actualPrice}
                            averageRating={item.averageRating}
                            totalReviews={item.totalReviews}
                        />
                    ))}
                </div>
            )}


        </div>
    )
}

export default LatestCollection