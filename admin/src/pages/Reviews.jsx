import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';
import { backendURL } from '../App'

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(backendURL + '/api/review/all');
            const data = response.data;

            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Product Reviews</h1>

            {reviews.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No reviews found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {review.name}
                                        </h3>
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

                                    <p className="text-sm text-gray-600 mb-2">
                                        Email: {review.email}
                                    </p>

                                    {review.productId && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            Product: {review.productId.name || 'Product not found'}
                                        </p>
                                    )}

                                    <p className="text-gray-700 leading-relaxed">
                                        {review.message}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <span className="text-sm text-gray-500">
                                        {formatDate(review.date)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;
