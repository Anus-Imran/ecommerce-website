import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";

// Add a new review
export const addReview = async (req, res) => {
    try {
        const { productId, name, email, rating, message } = req.body;

        // Validate required fields
        if (!productId || !name || !email || !rating || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        // Check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Create new review
        const newReview = new reviewModel({
            productId,
            name,
            email,
            rating,
            message
        });

        await newReview.save();

        // Update product with new review
        product.reviews.push(newReview._id);
        await product.save();

        res.status(201).json({ success: true, message: "Review added successfully", review: newReview });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get reviews for a specific product
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await reviewModel.find({ productId }).sort({ date: -1 });

        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        res.status(200).json({
            success: true,
            reviews,
            averageRating: parseFloat(averageRating),
            totalReviews: reviews.length
        });
    } catch (error) {
        console.error("Error getting reviews:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get all reviews (for admin)
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find().populate('productId', 'name').sort({ date: -1 });
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error("Error getting all reviews:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};





