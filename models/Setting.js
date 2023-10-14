const { Schema, model, models, default: mongoose } = require("mongoose")

const settingSchema = new Schema({
  name: {type:String, required: true, unique: true},
  value: {type:Object},
}, {timestamps: true});

export const Setting = models?.Setting || model('Setting', settingSchema);