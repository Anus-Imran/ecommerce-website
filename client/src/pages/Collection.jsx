import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

  const { products, search, showSearch, productsLoading } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevent')

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }
    setFilterProducts(productsCopy);
  }

  const sortProducts = () => {
    let filterProductsCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(filterProductsCopy.sort((a, b) => (a.salePrice - b.salePrice)));
        break;
      case 'high-low':
        setFilterProducts(filterProductsCopy.sort((a, b) => (b.salePrice - a.salePrice)));
        break;
      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    sortProducts();
  }, [sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10'>
      {/* Filter options */}

      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS  <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`} alt="" /></p>
        {/* Category filters  */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" name="" id="" value={'Men'} onChange={toggleCategory} /> Men
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" name="" id="" value={'Women'} onChange={toggleCategory} /> Women
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" name="" id="" value={'Kids'} onChange={toggleCategory} /> Kids
            </p>
          </div>
        </div>

        {/* Sub Category filter  */}

        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" name="" id="" value={'Topwear'} onChange={toggleSubCategory} /> Topwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" name="" id="" value={'Bottomwear'} onChange={toggleSubCategory} /> Bottomwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" name="" id="" value={'Winterwear'} onChange={toggleSubCategory} /> Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* Right side  */}

      <div className='flex-1'>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 text-sm px-2 py-1 outline-none rounded-md w-full sm:w-auto"
          >
            <option value="relevent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products  */}

        {productsLoading ? (
          <div className='flex justify-center items-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {
              filterProducts.map((item, index) => {
                return <ProductItem key={index} id={item._id} name={item.name} image={item.image} actualPrice={item.actualPrice} salePrice={item.salePrice} averageRating={item.averageRating} totalReviews={item.totalReviews} />
              })
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default Collection

