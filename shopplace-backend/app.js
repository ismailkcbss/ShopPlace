import express from "express";
import dotenv from 'dotenv';
import conn from './db.js';
import mainRoute from './src/routes/mainRoute.js'
import userRoute from './src/routes/userRoute.js';
import productRoute from './src/routes/ProductRoute.js';
import session from "express-session";
import { CheckUser } from "./src/middlewares/authMiddleWare.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";


const app = express();
dotenv.config(); //Contains environment variables
conn(); //DB connection

app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.use(cors({
    origin: ["http://localhost:3000"], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
})) 

app.use(session({
    key: "userdt",
    resave: false,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    cookie:{
        domain: 'http://localhost:3000',
    }
}))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested, Content-Type, Accept Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE")
        return res.status(200).json({})
    }
    next()
})


//app.post('*',CheckUser).get('*',CheckUser)
app.use('*',CheckUser);
app.use('/',userRoute);
app.use('/Main',mainRoute);
app.use('/User', userRoute);
app.use('/Product', productRoute);


let port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Network Connected Successfully: ${port}`);
})