import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { backendURL } = useContext(ShopContext)

    const handleStarClick = (starValue) => {
        setRating(starValue);
    };

    const handleStarHover = (starValue) => {
        setHoveredRating(starValue);
    };

    const handleStarLeave = () => {
        setHoveredRating(0);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(backendURL + '/api/review/add', {
                productId,
                rating,
                ...formData
            });

            const data = response.data;

            if (data.success) {
                toast.success("Review Submitted Successfully")
                setRating(0);
                setFormData({ name: '', email: '', message: '' });
                if (onReviewSubmitted) {
                    onReviewSubmitted();
                }
            } else {
                alert(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-6 h-6 cursor-pointer transition-all duration-200 hover:scale-110 ${star <= (hoveredRating || rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                onClick={() => handleStarClick(star)}
                                onMouseEnter={() => handleStarHover(star)}
                                onMouseLeave={handleStarLeave}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''} selected` : 'Click to rate'}
                    </p>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                        placeholder="Enter your name"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Email *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review *
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 outline-none border border-gray-300 rounded-md resize-none"
                        placeholder="Share your experience with this product..."
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
