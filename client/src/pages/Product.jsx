import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import axios from 'axios';
import { Star } from 'lucide-react';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })
  }

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/review/product/${productId}`);
      const data = response.data;
      
      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [productId, products])

  const handleReviewSubmitted = () => {
    fetchReviews();
  };

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* ------------------ product image ---------------------------  */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto' alt="" />
          </div>
        </div>

        {/*------------------------------ product info --------------------*/}

        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>
            {productData.name}
          </h1>
                     <div className='flex items-center gap-1 mt-2'>
             {[1, 2, 3, 4, 5].map((star) => (
               <Star 
                 key={star}
                 className={`w-3.5 ${star <= averageRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
               />
             ))}
             <p className='pl-2'>({totalReviews})</p>
           </div>
          <div className='flex items-center mt-5 text-3xl font-medium'>

            <p className='pr-3 text-xl line-through text-gray-500'>
              {currency}
              {productData.actualPrice}
            </p>
            <p>
              {currency}
              {productData.salePrice}
            </p>
          </div>
          <p className='mt-5 text-gray-500 md:w-4/5'>
            {productData.description}
          </p>
          <div className='flex flex-col gap-4 my-8'>
            <p >Select Size</p>
            <div className='flex gap-2'>
              {
                productData.sizes.map((item, index) => {
                  return <button onClick={() => setSize(item)} className={`py-2 px-4 border cursor-pointer ${item === size ? 'bg-black text-white' : ''}`} key={index}>{item}</button>
                })
              }
            </div>
          </div>
          <button onClick={() => addToCart(productData._id, size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5 text-gray-300' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange on policy within 7 days. </p>
          </div>
        </div>
      </div>

      {/* Description & Review section  */}
      <div className='mt-20'>
        <div className='flex'>
          <button 
            onClick={() => setActiveTab('description')}
            className={`px-5 py-3 text-sm border cursor-pointer ${activeTab === 'description' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 text-sm border cursor-pointer ${activeTab === 'reviews' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            Reviews ({totalReviews})
          </button>
        </div>
        
        <div className='border px-6 py-6'>
          {activeTab === 'description' ? (
            <div className='flex flex-col gap-4 text-sm text-gray-500'>
              <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
              <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
            </div>
          ) : (
            <div className='space-y-6'>
              {loading ? (
                <div className='text-center py-8'>
                  <p className='text-gray-500'>Loading reviews...</p>
                </div>
              ) : (
                <>
                  <ReviewList 
                    reviews={reviews} 
                    averageRating={averageRating} 
                    totalReviews={totalReviews} 
                  />
                  <ReviewForm 
                    productId={productId} 
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* display related products  */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className='opacity-0'>

  </div>
}

export default Product