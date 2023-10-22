import ClothesProduct from "../models/ClothesProductModel.js";
import ShoesProduct from "../models/ShoesProductModel.js";
import User from "../models/userModel.js";


const GetHomeAllProducts = async (req, res) => {
    try {
        const clothesProduct = await ClothesProduct.find({});
        const clothesCount = await ClothesProduct.countDocuments();

        const shoesProduct = await ShoesProduct.find({});
        const shoesCount = await ShoesProduct.countDocuments();

        const allProducts = shoesProduct.concat(clothesProduct);

        res.status(200).json({
            succeded: true,
            allProducts,
            clothesCount,
            shoesCount
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: error.message
        })
    }
}


const GetCategoryAllProducts = async (req, res) => {

}
export { GetHomeAllProducts, GetCategoryAllProducts }