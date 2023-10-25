import mongoose from "mongoose";

const {Schema} = mongoose;

const ShoesProductSchema = new Schema({
    productType:{
        type:String,
        required:[true,"You did not a product type."]
    },
    productGender:{
        type:String,
        required:[true,"You did not a product gender."]
    },
    productName:{
        type: String,
        required: [true, "You did not enter a product name."],
        lowercase: true,
    },
    productPrice:{
        type: Number,
        required: [true, "You did not enter a product price."],
        minLength: [1, "Set a price for the product."],
    },
    productPiece:{
        type: Number,
        required: [true, "You did not enter a product piece."],
        minLength: [1, "Set a price for the product."],
    },
    productDescription:{
        type: String,
        required: [true, "You did not enter a product description."],
    },
    productNumber:{
        type: Number,
        required: [true, "You did not enter a product number."],
    },
    productTypeOf:{
        type: String,
        required: [true, "You did not enter a product type."],
    },
    productColor:{
        type: String,
        required: [true, "You did not enter a product color."]
    },
    productModel:{
        type: String,
        required: [true, "You did not enter a product type."],
    },
    productImage:[String],

    productOwner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
})

const ShoesProduct = mongoose.model('shoesproduct', ShoesProductSchema);

export default ShoesProduct;
