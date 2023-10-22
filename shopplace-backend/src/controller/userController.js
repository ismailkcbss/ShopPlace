import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const CreateUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            succeded: true,
            user
        })
    } catch (error) {
        let errors2 = {};
        if (error.code === 11000) {
            errors2.email = "This email is registered";
        }
        if (error.name === "ValidationError") {
            Object.keys(error.errors).forEach((key) => {
                errors2[key] = error.errors[key].message;
            });
        }
        res.status(400).json(errors2);
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        let check = false;
        if (user) {
            check = await bcrypt.compare(password, user.password);
        } else {
            return res.status(401).json({
                succeded: false,
                error: "The user of the entered data could not be found",
            })
        }
        if (check) {
            const token = CreateUserToken(user._id, user.seller, user.admin);
            res.cookie('userdt', token, {
                path: '/',
                httpOnly: false,
                secure: true,
                maxAge: 1000 * 60 * 60 * 24,
            })
            res.status(201).json({
                succeded: true,
                user,
                token,
            });
        } else {
            res.status(401).json({
                succeded: false,
                error: "The entered password is incorrect",
            })
        }

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "Check your information"
        });
    }
};

const GetAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(201).json({
            succeded: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "Users could not be found",
        })
    }
}

const UserMe = async (req, res, next) => {
    const token = req.cookies.userdt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodeToken) => {
            if (error) {
                res.status(401).json({
                    succeded: false,
                    error: "You are not authorized to access the page",
                })
                next();
            } else {
                const user = await User.findById(decodeToken.userId);
                res.status(201).json({
                    succeded: true,
                    user,
                    token
                })
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

const CreateUserToken = (userId, seller, userRole) => {
    return jwt.sign({ userId, seller, userRole }, process.env.JWT_SECRET, {
        expiresIn: "1day",
    });
}

export { CreateUser, LoginUser, CreateUserToken, GetAllUsers, UserMe }