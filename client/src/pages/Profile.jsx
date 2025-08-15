import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { User, ShoppingBag, Heart, Settings, Mail, Calendar, Shield, CreditCard, Truck, Star } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const { token, backendURL, currency, navigate } = useContext(ShopContext);
    const [userData, setUserData] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
        fetchRecentOrders();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/user/profile`, {
                headers: { token }
            });
            if (response.data.success) {
                setUserData(response.data.user);
                // Fetch user reviews after user data is loaded
                fetchUserReviews(response.data.user.email);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchRecentOrders = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/order/userorders`, {
                headers: { token }
            });
            if (response.data.success) {
                setAllOrders(response.data.orders);
                setRecentOrders(response.data.orders.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserReviews = async (userEmail) => {
        try {
            const response = await axios.get(`${backendURL}/api/review/all`);
            if (response.data.success) {
                // Filter reviews by user email (since we don't have user ID in reviews yet)
                if (userEmail) {
                    const userReviews = response.data.reviews.filter(review => review.email === userEmail);
                    setUserReviews(userReviews);
                }
            }
        } catch (error) {
            console.error('Error fetching user reviews:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateStats = () => {
        const totalOrders = allOrders.length;
        const totalSpent = allOrders.reduce((sum, order) => sum + order.amount, 0);
        const deliveredOrders = allOrders.filter(order => order.status === 'Delivered').length;
        
        return {
            totalOrders,
            totalSpent,
            deliveredOrders,
            reviewsGiven: userReviews.length
        };
    };

    const stats = calculateStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your account and view your activity</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {userData?.name || 'User Name'}
                                </h3>
                                <p className="text-gray-500 text-sm">{userData?.email || 'user@example.com'}</p>
                            </div>

                            <nav className="space-y-2">
                                {[
                                    { id: 'overview', label: 'Overview', icon: User },
                                    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
                                    { id: 'wishlist', label: 'My Reviews', icon: Star },
                                    { id: 'settings', label: 'Settings', icon: Settings }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-black text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-8">
                        {activeTab === 'overview' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <ShoppingBag className="w-6 h-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                                <p className="text-2xl font-bold text-gray-900">{currency}{stats.totalSpent}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                <CreditCard className="w-6 h-6 text-green-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Delivered Orders</p>
                                                <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Truck className="w-6 h-6 text-green-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Reviews Given</p>
                                                <p className="text-2xl font-bold text-gray-900">{stats.reviewsGiven}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                <Star className="w-6 h-6 text-yellow-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                                        <button 
                                            onClick={() => navigate('/orders')} 
                                            className="text-sm text-black hover:underline"
                                        >
                                            View All
                                        </button>
                                    </div>
                                    
                                    {recentOrders.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentOrders.map((order) => (
                                                <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <Truck className="w-6 h-6 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">Order #{order._id.slice(-8)}</p>
                                                            <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                                                        </div>
                                                    </div>
                                                                                                         <div className="text-right">
                                                         <p className="font-medium text-gray-900">{currency}{order.amount}</p>
                                                         <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                                                             {order.status}
                                                         </span>
                                                     </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">No orders yet</p>
                                            <button className="mt-2 text-sm text-black hover:underline">Start Shopping</button>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium text-gray-900">{userData?.email || 'user@example.com'}</p>
                                                </div>
                                            </div>
                                                                                         <div className="flex items-center gap-3">
                                                 <Calendar className="w-5 h-5 text-gray-400" />
                                                 <div>
                                                     <p className="text-sm text-gray-500">Member Since</p>
                                                     <p className="font-medium text-gray-900">{userData ? formatDate(userData.date || new Date()) : formatDate(new Date())}</p>
                                                 </div>
                                             </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Account Status</p>
                                                    <p className="font-medium text-green-600">Active</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <User className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Account Type</p>
                                                    <p className="font-medium text-gray-900">Customer</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">My Orders</h3>
                                {allOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {allOrders.map((order) => (
                                            <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <p className="font-medium text-gray-900">Order #{order._id.slice(-8)}</p>
                                                        <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-900">{currency}{order.amount}</p>
                                                                                                                 <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                             order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                                             order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                                                             order.status === 'Processing' ? 'bg-yellow-100 text-yellow-600' :
                                                             order.status === 'Order Placed' ? 'bg-purple-100 text-purple-600' :
                                                             'bg-gray-100 text-gray-600'
                                                         }`}>
                                                             {order.status || 'Pending'}
                                                         </span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <p>Payment Method: {order.paymentMethod}</p>
                                                    <p>Payment Status: {order.payment ? 'Paid' : 'Pending'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No orders yet</p>
                                        <button className="mt-2 text-sm text-black hover:underline">Start Shopping</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">My Reviews</h3>
                                {userReviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {userReviews.map((review) => (
                                            <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{review.name}</p>
                                                        <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {review.rating} star{review.rating !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">{review.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No reviews yet</p>
                                        <p className="text-sm text-gray-400 mt-2">Start reviewing products to see them here</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
                                <p className="text-gray-500">Account settings and preferences will be available here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
