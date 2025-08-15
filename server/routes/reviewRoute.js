import express from "express";
import { addReview, getProductReviews, getAllReviews } from "../controllers/reviewController.js";

const router = express.Router();

// Add a new review
router.post("/add", addReview);

// Get reviews for a specific product
router.get("/product/:productId", getProductReviews);

// Get all reviews (for admin)
router.get("/all", getAllReviews);

export default router;





