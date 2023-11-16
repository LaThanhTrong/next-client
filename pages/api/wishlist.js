import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
    await mongooseConnect()
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const { user } = session
        if (req.method === 'POST') {
            const { inventory } = req.body
            const wishedDoc = await WishedProduct.findOne({ userEmail: user.email, inventory })
            if (wishedDoc) {
                await WishedProduct.findByIdAndDelete(wishedDoc._id)
                res.json({ wishedDoc })
            }
            else {
                await WishedProduct.create({ userEmail: user.email, inventory })
                res.json('created')
            }
        }
        if (req.method === 'GET') {
            res.json(
                await WishedProduct.find({ userEmail: user.email }).populate({
                    path: 'inventory',
                    populate: {
                        path: 'product',
                    }
                })
            )
        }
    }
    else {
        return res.json([])
    }
}