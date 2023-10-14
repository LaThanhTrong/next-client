import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { OrderDetail } from "@/models/OrderDetail";

export default async function handle(req, res) {
    await mongooseConnect()
    const {orderIds} = req.query
    const arr = orderIds.split(",")
    const {user} = await getServerSession(req,res,authOptions)
    res.json(await OrderDetail.find({order:{$in:arr}}))
}