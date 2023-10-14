const { Schema, model, models, default: mongoose } = require("mongoose")

const reviewSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    stars: {type: Number, required: true},
    inventory: {type:Schema.Types.ObjectId},
    userEmail: {type: String, required: true},
    userName: {type: String, required: true},
}, {timestamps: true});

export const Review = models?.Review || model('Review', reviewSchema);