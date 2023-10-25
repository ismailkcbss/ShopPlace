import mongoose from "mongoose";


const { Schema } = mongoose;

const FavoritesProductSchema = new Schema({
    userId: String,
    productId: String,
    productType: {
        type: String,
        lowercase: true,
    },

}, {
    timestamps: true,
})

const FavoritesProduct = mongoose.model('FavoritesProduct', FavoritesProductSchema);

export default FavoritesProduct;
