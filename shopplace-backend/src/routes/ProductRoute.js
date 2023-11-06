import express from 'express';
import * as ClothesProductController from '../controller/ClothesProductController.js';
import * as ShoesProductController from '../controller/ShoesProductController.js';
import * as BagProductController from '../controller/BagProductController.js';
import * as ElectronicProductController from '../controller/ElectronicProductController.js';
import * as PersonalCareProductController from '../controller/PersonalCareProductController.js';

const router = express.Router();



//Everyone Clothes
router.route('/Clothes')
    .post(ClothesProductController.CreateProduct)
    .get(ClothesProductController.GetEveryoneAllProducts)
router.route('/Single/Clothes/:id').get(ClothesProductController.GetEveryoneProduct)

//Seller Route Clothes
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
router.route('/Seller/Shoes/:id')
    .get(ShoesProductController.GetSellerProduct)
    .delete(ShoesProductController.DeleteProduct)
    .post(ShoesProductController.UpdateProduct)




//Everyone Bag
router.route('/Bag')
    .post(BagProductController.CreateProduct)
    .get(BagProductController.GetEveryoneAllProducts)
router.route('/Single/Bag/:id').get(BagProductController.GetEveryoneProduct)

//Seller Route Bag
router.route('/Seller/Bag/:id')
    .get(BagProductController.GetSellerProduct)
    .delete(BagProductController.DeleteProduct)
    .post(BagProductController.UpdateProduct)




//Everyone Electronic
router.route('/Electronic')
    .post(ElectronicProductController.CreateProduct)
    .get(ElectronicProductController.GetEveryoneAllProducts)
router.route('/Single/Electronic/:id').get(ElectronicProductController.GetEveryoneProduct)

//Seller Route Electronic
router.route('/Seller/Electronic/:id')
    .get(ElectronicProductController.GetSellerProduct)
    .delete(ElectronicProductController.DeleteProduct)
    .post(ElectronicProductController.UpdateProduct)


    

//Everyone PersonalCare
router.route('/PersonalCare')
    .post(PersonalCareProductController.CreateProduct)
    .get(PersonalCareProductController.GetEveryoneAllProducts)
router.route('/Single/PersonalCare/:id').get(PersonalCareProductController.GetEveryoneProduct)

//Seller Route PersonalCare
router.route('/Seller/PersonalCare/:id')
    .get(PersonalCareProductController.GetSellerProduct)
    .delete(PersonalCareProductController.DeleteProduct)
    .post(PersonalCareProductController.UpdateProduct)



export default router;
