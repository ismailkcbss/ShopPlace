import express from 'express';
import * as MainController from '../controller/MainController.js';


//Everyone
const router = express.Router();

router.route('/ContactUs').post(MainController.WebsiteSendMail)

router.route('/Home').get(MainController.GetHomeAllProducts)


export default router;