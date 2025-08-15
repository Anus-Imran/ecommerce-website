import React from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { Star } from 'lucide-react';

const ReviewList = ({ reviews, averageRating, totalReviews }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Review Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800">{averageRating}</div>
                                                 <div className="flex gap-1 mt-1">
                             {[1, 2, 3, 4, 5].map((star) => (
                                 <Star
                                     key={star}
                                     className={`w-4 h-4 ${star <= averageRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                 />
                             ))}
                         </div>
                        <div className="text-sm text-gray-600 mt-1">
                            {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Customer Reviews</h3>
                        <p className="text-gray-600 text-sm">
                            Based on {totalReviews} customer review{totalReviews !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-semibold text-gray-800">{review.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
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
                            <span className="text-sm text-gray-500">
                                {formatDate(review.date)}
                            </span>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed">
                            {review.message}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
