import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {

    const { products, productsLoading } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        console.log("All products:", products);
        const bestProduct = products.filter((item) => item.bestSeller === true);
        console.log("Best sellers:", bestProduct);
        setBestSeller(bestProduct.slice(0, 5));
    }, [products])

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={"BEST"} text2={"SELLERS"} />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa eaque, dolorem odit non labore inventore!
                </p>
            </div>

            {productsLoading ? (
                <div className='flex justify-center items-center py-20'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                    {
                        bestSeller.map((item, index) => {
                            return <ProductItem key={index} id={item._id} name={item.name} image={item.image} actualPrice={item.actualPrice} salePrice={item.salePrice} averageRating={item.averageRating} totalReviews={item.totalReviews} />
                        })
                    }
                </div>
            )}


        </div>
    )
}

export default BestSeller