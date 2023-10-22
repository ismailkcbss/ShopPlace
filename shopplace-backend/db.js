import mongoose from "mongoose";

const conn = () => {
    try {
        mongoose.connect(process.env.DB_URL, {
            dbName: 'ShopPlace',
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`DB Connected Successfully`);
    } catch (error) {
        console.log(`DB Connected error: ${error}`);
    }
}

export default conn;