import mongoose from "mongoose";


const { Schema } = mongoose;

const OrdersReceivedSchema = new Schema({

    orderProducts: [],
    customer: {
        type: String,
        required: [true, "You did not found the customer."],
        lowercase: true,
    },
    shippingAdress: {
        type: String,
        required: [true, "You did not found the shipping address."],
        lowercase: true,
    },
    orderSumPrice: {
        type: Number,
        required: [true, "You did not found the  order sum price."],
    },
}, {
    timestamps: true,
});

const OrdersReceived = mongoose.model('ordersreceived', OrdersReceivedSchema);

export default OrdersReceived;