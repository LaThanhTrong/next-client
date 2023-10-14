const { Schema, model, models, default: mongoose } = require("mongoose")

const WishedProductSchema = new Schema({
    userEmail: {type: String, required: true},
    inventory: {type: Schema.Types.ObjectId, ref: 'Inventory'},
})

export const WishedProduct = models?.WishedProduct || model('WishedProduct', WishedProductSchema)

