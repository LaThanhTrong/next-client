import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Inventory } from "@/models/Inventory";

export default async function handle(req,res) {
    await mongooseConnect()
    const ids = req.body.ids;
    res.json(await Inventory.find({_id:ids}).populate('product'));
}