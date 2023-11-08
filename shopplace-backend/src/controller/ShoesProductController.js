import User from '../models/userModel.js';
import ShoesProduct from '../models/ShoesProductModel.js';
import FavoritesProduct from '../models/FavoritesModal.js';

// USER-ROLE = EVERYONE CONTROLLER

const CreateProduct = async (req, res) => {
    try {
        const requiredFields = [
            'productType',
            'productGender',
            'productName',
            'productBrand',
            'productPrice',
            'productPiece',
            'productDescription',
            'productColor',
            'productNumber',
            'productCategory',
            'productModel',
            'productImage'
        ];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    succeeded: false,
                    error: `The ${field} field is missing or empty.`,
                });
            }
        }

        const shoesProduct = await ShoesProduct.create({
            productOwner: res.locals.user._id,
            productType: req.body.productType,
            productGender: req.body.productGender,
            productName: req.body.productName,
            productBrand: req.body.productBrand,
            productPrice: req.body.productPrice,
            productPiece: req.body.productPiece,
            productDescription: req.body.productDescription,
            productColor: req.body.productColor,
            productNumber: req.body.productNumber,
            productCategory: req.body.productCategory,
            productModel: req.body.productModel,
            productImage: req.body.productImage.split(',')
        })
        res.status(200).json({
            succeded: true,
            message:'The product created successfully',
            shoesProduct
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The product could not be created'
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
            message:'Successfully',
            allData,
            count
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'Products could not be found'
        })
    }
}
const GetEveryoneProduct = async (req, res) => {
    try {
        const shoesProduct = await ShoesProduct.findById(req.params.id);
        res.status(200).json({
            succeded: true,
            message:'Successfully',
            shoesProduct
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The product was not found'
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
            message:'The product information has been successfully retrieved.',
            shoesProduct,
            user
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The product was not found'
        })
    }
}

const DeleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const usersWithFavorite = await FavoritesProduct.find({ productId: productId });

        for (const favorite of usersWithFavorite) {
            await FavoritesProduct.findByIdAndRemove(favorite._id);
        }

        await ShoesProduct.findByIdAndRemove({ _id: productId })

        res.status(200).json({
            succeded: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The product could not be deleted'
        })
    }
}

const UpdateProduct = async (req, res) => {
    try {
        const shoesProduct = await ShoesProduct.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

        res.status(200).json({
            succeded: true,
            message: "Product updated successfully",
            shoesProduct
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The product could not be updated'
        })
        console.log(error);
    }

}


export { CreateProduct, GetEveryoneAllProducts, GetEveryoneProduct, GetSellerProduct, DeleteProduct, UpdateProduct }