import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        message: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }
)

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;





