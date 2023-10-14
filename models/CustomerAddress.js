const { Schema, model, models, default: mongoose } = require("mongoose")

const CustomerAddressSchema = new Schema({
    userEmail: {type:String, required:true},
    address: {type:String, required:true},
})

// Create a unique compound index on userEmail and address
CustomerAddressSchema.index({ userEmail: 1, address: 1 }, { unique: true });

export const CustomerAddress = models?.CustomerAddress || model('CustomerAddress', CustomerAddressSchema)