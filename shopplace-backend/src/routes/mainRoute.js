import express from 'express';
import * as MainController from '../controller/MainController.js';


//Everyone
const router = express.Router();

router.route('/ContactUs').post(MainController.WebsiteSendMail)

router.route('/Home').get(MainController.GetHomeAllProducts)


router.route('/Favorite/Add').post(MainController.FavoriteAdd);
router.route('/Favorite/Products').get(MainController.GetAllFavoriteProducts);
router.route('/Favorite/Products/:id').delete(MainController.FavoriteProductsDelete);


router.route('/MyOrder').post(MainController.MyOrderSendMail, MainController.OrdersReceivedCreate)
router.route('/MyOrder/Seller').get(MainController.GetOrderReceived);
router.route('/MyOrder/Customer').get(MainController.GetOrderPlaced);



export default router;