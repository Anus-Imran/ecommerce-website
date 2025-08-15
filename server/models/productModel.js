import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        actualPrice: { type: Number, required: true },
        salePrice: { type: Number, required: true },
        description: { type: String, required: true },
        image: { type: Array, required: true },
        category: { type: String, required: true },
        subCategory: { type: String, required: true },
        sizes: { type: Array, required: true },
        bestSeller: { type: Boolean },
        date: { type: Number, required: true },
        rating: { type: Number },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    }
)

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;