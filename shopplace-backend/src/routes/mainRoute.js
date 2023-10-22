import express from 'express';
import * as MainController from '../controller/MainController.js';


//Everyone
const router = express.Router();

router.route('/Home').get(MainController.GetHomeAllProducts)
router.route('/Category/:productType').get(MainController.GetCategoryAllProducts)


export default router;