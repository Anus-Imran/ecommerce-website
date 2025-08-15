import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js";

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Check if product already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.json({ success: false, message: "Product already in wishlist" });
        }

        // Add to wishlist
        user.wishlist.push(productId);
        await user.save();

        res.json({ success: true, message: "Added to wishlist" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Remove from wishlist
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.json({ success: true, message: "Removed from wishlist" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get user wishlist
const getWishlist = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId).populate({
            path: 'wishlist',
            select: 'name image actualPrice salePrice category subCategory'
        });
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Calculate averageRating and totalReviews for each product
        const wishlistWithReviews = await Promise.all(
            user.wishlist.map(async (product) => {
                const reviews = await reviewModel.find({ productId: product._id });
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
                
                return {
                    ...product.toObject(),
                    averageRating: parseFloat(averageRating),
                    totalReviews: reviews.length
                };
            })
        );

        res.json({ success: true, wishlist: wishlistWithReviews });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Check if product is in wishlist
const checkWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.userId;

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isInWishlist = user.wishlist.includes(productId);

        res.json({ success: true, isInWishlist });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToWishlist, removeFromWishlist, getWishlist, checkWishlist };
