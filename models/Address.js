const { Schema, model, models, default: mongoose } = require("mongoose")

const AddressSchema = new Schema({
    userEmail: {type:String, unique:true, required:true},
    name: String,
    email: String,
    phoneNumber: String,
})

export const Address = models?.Address || model('Address', AddressSchema)