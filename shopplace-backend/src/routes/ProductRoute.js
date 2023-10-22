import express from 'express';
import * as ClothesProductController from '../controller/ClothesProductController.js';
import * as ShoesProductController from '../controller/ShoesProductController.js'


const router = express.Router();

//Everyone Clothes
router.route('/Clothes')
    .post(ClothesProductController.CreateProduct)
    .get(ClothesProductController.GetEveryoneAllProducts)
router.route('/Single/Clothes/:id').get(ClothesProductController.GetEveryoneProduct)

//Seller Route Clothes
router.route('/Seller/Clothes')
    .get(ClothesProductController.GetSellerAllProducts)
router.route('/Seller/Clothes/:id')
    .get(ClothesProductController.GetSellerProduct)
    .delete(ClothesProductController.DeleteProduct)
    .post(ClothesProductController.UpdateProduct)



//Everyone Shoes
router.route('/Shoes')
    .post(ShoesProductController.CreateProduct)
    .get(ShoesProductController.GetEveryoneAllProducts)
router.route('/Single/Shoes/:id').get(ShoesProductController.GetEveryoneProduct)

//Seller Route Shoes
router.route('/Seller/Shoes')
    .get(ShoesProductController.GetSellerAllProducts)
router.route('/Seller/Shoes/:id')
    .get(ShoesProductController.GetSellerProduct)
    .delete(ShoesProductController.DeleteProduct)
    .post(ShoesProductController.UpdateProduct)


export default router;
