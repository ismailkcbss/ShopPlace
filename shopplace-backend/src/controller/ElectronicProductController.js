import ElectronicProduct from '../models/ElectronicProductModel.js'
import FavoritesProduct from "../models/FavoritesModal.js";
import User from "../models/userModel.js";


// USER-ROLE = EVERYONE CONTROLLER

const CreateProduct = async (req, res) => {
    try {
        const electronicProduct = await ElectronicProduct.create({
            productOwner: res.locals.user._id,
            productType: req.body.productType,
            productGender: req.body.productGender,
            productName: req.body.productName,
            productBrand: req.body.productBrand,
            productPrice: req.body.productPrice,
            productPiece: req.body.productPiece,
            productDescription: req.body.productDescription,
            productColor: req.body.productColor,
            productCategory: req.body.productCategory,
            productGuaranteePeriod: req.body.productGuaranteePeriod,
            productImage: req.body.productImage.split(',')
        })
        res.status(201).json({
            succeded: true,
            electronicProduct
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: error
        })
    }
}
const GetEveryoneAllProducts = async (req, res) => {
    let { search } = req.query;
    try {
        const allData = await ElectronicProduct.find({ "productName": new RegExp(search, "i") })
        const count = await ElectronicProduct.countDocuments()
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
        const electronicProduct = await ElectronicProduct.findById(req.params.id);

        res.status(201).json({
            succeded: true,
            electronicProduct
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
        const electronicProduct = await ElectronicProduct.findById(req.params.id);
        const user = await User.findById(res.locals.user._id)

        res.status(201).json({
            succeded: true,
            electronicProduct,
            user,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "The requested product could not be received"
        })
    }
}

const DeleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const userFavorites = await FavoritesProduct.find({})

        for (const favorite of userFavorites) {
            if (favorite.productId.toString() === productId.toString()) {
                await FavoritesProduct.findByIdAndRemove(favorite._id)
                return;
            }
        }

        await ElectronicProduct.findByIdAndRemove({ _id: productId })

        res.status(200).json({
            succeded: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "The product data could not be deleted"
        })
    }
}

const UpdateProduct = async (req, res) => {
    try {
        const electronicProduct = await ElectronicProduct.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
        res.status(200).json({
            succeded: true,
            electronicProduct
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "Data could not be updated"
        })
        console.log(error);
    }
}






export { CreateProduct, GetEveryoneProduct, GetEveryoneAllProducts, GetSellerProduct, DeleteProduct, UpdateProduct }