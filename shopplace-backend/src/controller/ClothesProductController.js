import ClothesProduct from "../models/ClothesProductModel.js";
import ShoesProduct from "../models/ShoesProductModel.js";
import User from "../models/userModel.js";

// USER-ROLE = EVERYONE CONTROLLER

const CreateProduct = async (req, res) => {
    try {
        const clothesProduct = await ClothesProduct.create({
            productOwner: res.locals.user._id,
            productType: req.body.productType,
            productGender: req.body.productGender,
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            productPiece: req.body.productPiece,
            productDescription: req.body.productDescription,
            productSize: req.body.productSize,
            productPattern: req.body.productPattern,
            productCollerType: req.body.productCollerType,
            productColor: req.body.productColor,
            productMaterial: req.body.productMaterial,
            productPackageContent: req.body.productPackageContent,
            productHeight: req.body.productHeight,
            productImage: req.body.productImage.split(',')
        })
        res.status(201).json({
            succeded: true,
            clothesProduct
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: error.message
        })
    }
}
const GetEveryoneAllProducts = async (req, res) => {
    try {
        const allData = await ClothesProduct.find({})
        const count = await ClothesProduct.countDocuments()
        res.status(200).json({
            succeded: true,
            allData,
            count
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: error.message
        })
    }
}

const GetEveryoneProduct = async (req, res) => {
    try {
        const clothesProduct = await ClothesProduct.findById(req.params.id);

        res.status(201).json({
            succeded: true,
            clothesProduct
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "The requested product could not be received"
        })
    }
}




// USER-ROLE = SELLER CONTROLLER

const GetSellerProduct = async (req, res) => {
    try {
        const clothesProduct = await ClothesProduct.findById(req.params.id);
        const user = await User.findById(res.locals.user._id)

        res.status(201).json({
            succeded: true,
            clothesProduct,
            user,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "The requested product could not be received"
        })
    }
}

const GetSellerAllProducts = async (req, res) => {
    try {
        const allProducts = [];
    // Bu durumda butun şemalara istek atmak zorundayım ve kontrolu sağlayıp diziye aktarmalıyım mongo sadece bu şekilde izin veriyor.

        const clothesProduct = await ClothesProduct.find({ productOwner: res.locals.user._id })
        if (clothesProduct.length > 0) {
            allProducts.push(...clothesProduct);
        }

        const shoesProduct = await ShoesProduct.find({ productOwner: res.locals.user._id },)
        if (shoesProduct.length > 0) {
            allProducts.push(...shoesProduct);
        }

        res.status(201).json({
            succeded: true,
            allProducts
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "Products could not be brought"
        })
    }
}

const DeleteProduct = async (req, res) => {
    try {
        await ClothesProduct.findByIdAndRemove({ _id: req.params.id })
        res.status(200).json({
            succeded: true,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "The product data could not be deleted"
        })
    }
}

const UpdateProduct = async (req, res) => {
    try {
        const clothesProduct = await ClothesProduct.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
        res.status(200).json({
            succeded: true,
            clothesProduct
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "Data could not be updated"
        })
        console.log(error);
    }
}






export { CreateProduct, GetEveryoneProduct, GetEveryoneAllProducts, GetSellerProduct, GetSellerAllProducts, DeleteProduct, UpdateProduct }