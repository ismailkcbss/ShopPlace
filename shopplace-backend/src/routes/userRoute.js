import express from 'express';
import * as userController from '../controller/userController.js';
import * as authMiddleWare from '../middlewares/authMiddleWare.js';

const router = express.Router();

router.route('/').get((req, res) => {
    res.send('Hello, Welcome to Shop Place !')
})

router.route('/Register').post(userController.CreateUser);
router.route('/Login').post(userController.LoginUser);


router.route('/GetAllUser').get(userController.GetAllUsers);
router.route('/UserMe').get(authMiddleWare.AuthenticateToken, userController.UserMe);


export default router;