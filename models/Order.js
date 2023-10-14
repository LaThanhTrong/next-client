const { Schema, model, models, default: mongoose } = require("mongoose")

const OrderSchema = new Schema({
    userEmail: String,
    name: String,
    email: String,
    address: String,
    phoneNumber: String,
    paid: Boolean,
    shippingFee: Number,
    discount_amount: Number,
}, {
    timestamps: true
})

export const Order = models?.Order || model('Order',OrderSchema) 