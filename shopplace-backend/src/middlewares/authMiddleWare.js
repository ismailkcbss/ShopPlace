import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const CheckUser = async (req, res, next) => {
    const token = req.cookies.userdt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
            if (error) {
                res.status(401).json({
                    succeded: false,
                    error: "You are not authorized to access the page"
                })
                res.locals.user = null;
                next();
            } else {
                const user = await User.findById(decodedToken.userId);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }

}

const AuthenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.userdt;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (error) => {
                if (error) {
                    res.status(401).json({
                        succeeded: false,
                        error: "You are not authorized to access the page"
                    })
                    res.redirect('/Login');
                } else {
                    next();
                }
            });
        } else {
            res.redirect('/Login')
        }
    } catch (error) {
        res.status(401).json({
            succeeded: false,
            error: 'You are not authorized to access the page',
        });
    }
}

const AuthenticateSeller = async (req, res, next) => {
    try {
        const token = req.cookies.userdt;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
                if (error) {
                    res.status(401).json({
                        succeded: false,
                        error: "You are not authorized to access the page"
                    })
                    res.locals.user = null;
                    next();
                } else {
                    const user = await User.findById(decodedToken.userId);
                    res.locals.user = user;
                    next();
                }
            })
        } else{
            res.locals.user = null;
            next();
        }
    } catch (error) {
        res.locals.user = null;
        res.status(401).json({
            error: 'You are not authorized to access'
        })
        next();
    }
}



export { CheckUser, AuthenticateToken, AuthenticateSeller }