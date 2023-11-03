import User from '../models/userModel.js';
import ShoesProduct from '../models/ShoesProductModel.js';
import FavoritesProduct from '../models/FavoritesModal.js';

// USER-ROLE = EVERYONE CONTROLLER

const CreateProduct = async (req, res) => {
    try {
        const shoesProduct = await ShoesProduct.create({
            productOwner: res.locals.user._id,
            productType: req.body.productType,
            productGender: req.body.productGender,
            productName: req.body.productName,
            productBrand: req.body.productBrand,
            productPrice: req.body.productPrice,
            productPiece: req.body.productPiece,
            productDescription: req.body.productDescription,
            productNumber: req.body.productNumber,
            productTypeOf: req.body.productTypeOf,
            productColor: req.body.productColor,
            productModel: req.body.productModel,
            productImage: req.body.productImage.split(',')
        })
        res.status(200).json({
            succeded: true,
            shoesProduct
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: error.message
        })
    }
}

const GetEveryoneAllProducts = async (req, res) => {
    let { search } = req.query;
    try {
        const allData = await ShoesProduct.find({ "productName": new RegExp(search, "i") })
        const count = await ShoesProduct.countDocuments()
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
        const shoesProduct = await ShoesProduct.findById(req.params.id);
        res.status(200).json({
            succeded: true,
            shoesProduct
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: error.message
        })
    }
}

// USER-ROLE = SELLER CONTROLLER

const GetSellerProduct = async (req, res) => {
    try {
        const shoesProduct = await ShoesProduct.findById(req.params.id);
        const user = await User.findById(res.locals.user._id);

        res.status(200).json({
            succeded: true,
            shoesProduct,
            user
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: error.message
        })
    }
}

const GetSellerAllProducts = async (req, res) => {
    let { limit, offset, search } = req.query;
    try {
        const shoesProduct = await ShoesProduct.find({
            $and: [
                { productOwner: res.locals.user._id },
                { "productName": new RegExp(search, "i") }
            ]
        }).skip(offset).limit(limit).sort({ "updatedAt": -1 })

        const count = await ShoesProduct.countDocuments({
            $and: [
                { productOwner: res.locals.user._id },
                { "productName": new RegExp(search, "i") }
            ]
        })

        res.status(200).json({
            succeded: true,
            shoesProduct,
            count
        })

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: error.message
        })
    }
}

const DeleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        await ShoesProduct.findByIdAndRemove({ _id: productId })

        const userFavorites = await FavoritesProduct.find({})

        for (const favorite of userFavorites) {
            if (favorite.productId.toString() === productId.toString()) {
                await FavoritesProduct.findByIdAndRemove(favorite._id)
                res.status(200).json({
                    succeded: true,
                    message: "Product deleted successfully",
                });
                return;
            }
        }
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: error.message
        })
    }
}

const UpdateProduct = async (req, res) => {
    try {
        const shoesProduct = await ShoesProduct.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

        res.status(200).json({
            succeded: true,
            shoesProduct
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: error.message
        })
    }
}


export { CreateProduct, GetEveryoneAllProducts, GetEveryoneProduct, GetSellerProduct, GetSellerAllProducts, DeleteProduct, UpdateProduct }