import { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const { navigate, backendURL, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({

    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',

  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value

    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (e) => {

    e.preventDefault()
    setLoading(true)

    try {

      let orderItems = []

      for (const items in cartItems) {

        for (const size in cartItems[items]) {

          if (cartItems[items][size] > 0) {

            const itemInfo = structuredClone(products.find(product => product._id === items))

            if (itemInfo) {

              itemInfo.size = size

              itemInfo.quantity = cartItems[items][size]

              orderItems.push(itemInfo)

            }

          }

        }
      }

      let orderData = {

        address: formData,

        items: orderItems,

        amount: getCartAmount() + delivery_fee

      }

      if (method === 'cod') {

        const response = await axios.post(backendURL + '/api/order/place', orderData, { headers: { token } })

        if (response.data.success) {

          toast.success('Order Placed Successfully')

          setCartItems({})
          localStorage.removeItem('cartItems')

          navigate('/orders')

        } else {

          toast.error(response.data.message)

        }

             } else if (method === 'stripe') {

         const response = await axios.post(backendURL + '/api/order/stripe', orderData, { headers: { token } })

         if (response.data.success) {

           console.log('Redirecting to Stripe:', response.data.url)
           window.location.href = response.data.url

         } else {

           toast.error(response.data.message || 'Stripe payment failed')

         }

      } else if (method === 'razorpay') {

        const response = await axios.post(backendURL + '/api/order/razorpay', orderData, { headers: { token } })

        if (response.data.success) {

          window.location.href = response.data.url

        } else {

          toast.error(response.data.message)

        }

      }

    } catch (error) {

      console.log(error)

      toast.error(error.message)

    } finally {
      setLoading(false)
    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left side  */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text0xl sm:text-2xl my-3'>
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='firstName' value={formData.firstName} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='First Name' />
          <input onChange={onChangeHandler} name='lastName' value={formData.lastName} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='Last Name' />
        </div>
        <input onChange={onChangeHandler} name='email' value={formData.email} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="email" placeholder='Email Address' id="" />
        <input onChange={onChangeHandler} name='street' value={formData.street} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='Street' id="" />
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='city' value={formData.city} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='City' />
          <input onChange={onChangeHandler} name='state' value={formData.state} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} required name='zipCode' value={formData.zipCode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="number" placeholder='Zipcode' />
          <input onChange={onChangeHandler} required name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='Country' />
        </div>
        <input onChange={onChangeHandler} required name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="number" placeholder='Phone' />
      </div>

      {/* right side  */}

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          {/* Payment method selection  */}

        </div>
        <div className='flex gap-3 flex-col lg:flex-row'>
          <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border-1 border-gray-300 p-2 px-3 cursor-pointer'>
            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
            <img src={assets.stripe_logo} className='h-5 mx-4' alt="" />
          </div>
          <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border-1 border-gray-300 p-2 px-3 cursor-pointer'>
            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
            <img src={assets.razorpay_logo} className='h-5 mx-4' alt="" />
          </div>
          <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border-1 border-gray-300 p-2 px-3 cursor-pointer'>
            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
          </div>
        </div>

        <div className='w-full text-end mt-8'>
          <button 
            type='submit' 
            disabled={loading}
            className={`px-16 py-3 text-sm cursor-pointer ${loading ? 'bg-gray-400' : 'bg-black'} text-white`}
          >
            {loading ? 'Processing...' : 'PLACE ORDER'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder