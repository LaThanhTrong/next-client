const { Schema, model, models } = require("mongoose");

const OrderSchema = new Schema({
    userEmail: String,
    line_items: Object,
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