const { Schema, model, models, default: mongoose } = require("mongoose")

const InventorySchema = new Schema({
    product: {type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: {type: Number, default: 0},
    price: {type: Number, default: 0}
}, { 
    timestamps: true,
})

export const Inventory = models.Inventory || model("Inventory", InventorySchema); 