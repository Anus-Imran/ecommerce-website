// import React from 'react'
// import { useEffect } from 'react'
// import { useState } from 'react'
// import axios from 'axios'
// import { backendURL, currency } from '../App'
// import { toast } from 'react-toastify'
// import { assets } from '../assets/assets'

// const orders = ({ token }) => {

//     const [orders, setOrders] = useState([])
//     const [loading, setLoading] = useState(false)

//     const fetchAllOrders = async () => {
//         if (!token) {
//             return null;
//         }

//         setLoading(true);
//         try {

//             const response = await axios.post(backendURL + '/api/order/list', {}, { headers: { token } })

//             if (response.data.success) {
//                 setOrders(response.data.orders.reverse())
//             } else {
//                 toast.error(response.data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//         } finally {
//             setLoading(false);
//         }
//     }

//     const statusHandler = async (event, orderId) => {
//         try {

//             const response = await axios.post(backendURL + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })

//             if (response.data.success) {
//                 await fetchAllOrders()
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(response.data.message)
//         }
//     }

//     useEffect(() => {
//         fetchAllOrders()
//     }, [])

//     return (
//         <div>
//             <h3>Order Page</h3>

//             {loading ? (
//                 <div className='flex justify-center items-center py-20'>
//                     <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
//                 </div>
//             ) : (
//                 <div>
//                     {
//                         orders.map((order, index) => (
//                         <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
//                             <img className='w-12' src={assets.parcel_icon} alt="" />
//                             <div>

//                                 <div>
//                                     {order.items.map((item, index) => {
//                                         if (index === order.items.length - 1) {
//                                             return <p className='py-0.5' key={index}>
//                                                 {item.name} X {item.quantity} <span>{item.size}</span>
//                                             </p>
//                                         } else {
//                                             return <p className='py-0.5' key={index}>
//                                                 {item.name} X {item.quantity} <span>{item.size},</span>
//                                             </p>
//                                         }
//                                     })}
//                                 </div>
//                                 <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
//                                 <div>
//                                     <p>{order.address.street + ","}</p>
//                                     <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipCode}</p>
//                                 </div>
//                                 <p>{order.address.phone}</p>
//                             </div>
//                             <div>
//                                 <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
//                                 <p className='mt-3'>Method : {order.paymentMethod}</p>
//                                 <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
//                                 <p>Date : {new Date(order.date).toLocaleDateString()}</p>
//                             </div>
//                             <p className='text-sm sm:text-[15px]'>{currency} {order.amount}</p>
//                             <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className='p-2 font-semibold'>
//                                 <option value="Order Placed">Order Placed</option>
//                                 <option value="Packing">Packing</option>
//                                 <option value="Shipped">Shipped</option>
//                                 <option value="Out for delivery">Out for delivery</option>
//                                 <option value="Delivered">Delivered</option>
//                             </select>
//                         </div>
//                     ))
//                 }
//                 </div>
//             )}
//         </div>
//     )
// }

// export default orders




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendURL, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    if (!token) return null;
    setLoading(true);
    try {
      const response = await axios.post(
        backendURL + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) setOrders(response.data.orders.reverse());
      else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendURL + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) await fetchAllOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Orders
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-5 md:p-6 flex flex-col md:flex-row md:items-start md:gap-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Parcel Icon */}
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <img
                  src={assets.parcel_icon}
                  alt="Parcel"
                  className="w-14 h-14 md:w-16 md:h-16"
                />
              </div>

              {/* Order Items & Address */}
              <div className="flex-1">
                {/* Items */}
                <div className="text-gray-700 text-sm md:text-base mb-3">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="py-0.5">
                      {item.name} x {item.quantity}{' '}
                      <span className="text-gray-500">{item.size}</span>
                      {idx !== order.items.length - 1 && ','}
                    </p>
                  ))}
                </div>

                {/* Customer Info */}
                <p className="font-medium text-gray-800 mt-2">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p className="text-gray-600 text-sm">
                  {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipCode}
                </p>
                <p className="text-gray-600 text-sm mt-1">📞 {order.address.phone}</p>
              </div>

              {/* Order Details */}
              <div className="mt-4 md:mt-0 flex flex-col gap-2 min-w-[150px] text-sm md:text-base">
                <p>Items: <span className="font-semibold">{order.items.length}</span></p>
                <p>Payment Method: <span className="font-semibold">{order.paymentMethod}</span></p>
                <p>Payment Status: <span className={`font-semibold ${order.payment ? 'text-green-600' : 'text-red-600'}`}>{order.payment ? 'Done' : 'Pending'}</span></p>
                <p>Date: <span className="font-semibold">{new Date(order.date).toLocaleDateString()}</span></p>
              </div>

              {/* Amount & Status */}
              <div className="mt-4 md:mt-0 flex flex-col gap-3 items-start md:items-end">
                <p className="text-lg md:text-xl font-bold text-blue-600">{currency} {order.amount}</p>
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className="p-2 rounded-md border border-gray-300 bg-white font-semibold hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
