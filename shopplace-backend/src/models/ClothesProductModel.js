import mongoose from "mongoose";

const { Schema } = mongoose;

const ClothesProductSchema = new Schema({
    productType: {
        type: String,
        required: [true, "You did not enter a product type."]
    },
    productGender: {
        type: String,
        required: [true, "You did not a product gender."]
    },
    productName: {
        type: String,
        required: [true, "You did not enter a product name."],
        lowercase: true,
    },
    productBrand: {
        type: String,
        required: [true, "You did not enter a product brand."],
        lowercase: true,
    },
    productPrice: {
        type: Number,
        required: [true, "You did not enter a product price."],
        minLength: [1, "Set a price for the product."],
    },
    productPiece: {
        type: Number,
        required: [true, "You did not enter a product piece."],
        minLength: [1, "Set a price for the product."],
    },
    productDescription: {
        type: String,
        required: [true, "You did not enter a product description."],
    },
    productSize: {
        type: String,
        required: [true, "You did not enter a product size."],
    },
    productPattern: {
        type: String,
        required: [true, "You did not enter a product pattern."],
    },
    productCollerType: {
        type: String,
        required: [true, "You did not enter a product coller type."]
    },
    productColor: {
        type: String,
        required: [true, "You did not enter a product color."]
    },
    productMaterial: {
        type: String,
        required: [true, "You did not enter a product material."]
    },
    productHeight: {
        type: String,
        required: [true, "You did not enter a product height."]
    },
    productImage: [String],

    productOwner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
});

const ClothesProduct = mongoose.model('clothesproduct', ClothesProductSchema);

export default ClothesProduct;