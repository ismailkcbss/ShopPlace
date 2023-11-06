import mongoose from "mongoose";


const { Schema } = mongoose;

const ElectronicProductSchema = new Schema({
    productType: {
        type: String,
        required: [true, "You did not a product type."]
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
    productColor: {
        type: String,
        required: [true, "You did not enter a product color."],
    },
    productCategory: {
        type: String,
        required: [true, "You did not enter a product type of."],
    },
    productGuaranteePeriod: {
        type: Number,
        required: [true, "You did not enter a product guarantee period."],
    },



    productImage: [String],

    productOwner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }

}, {
    timestamps: true,
})

const ElectronicProduct = mongoose.model('electronicproduct', ElectronicProductSchema);
export default ElectronicProduct;