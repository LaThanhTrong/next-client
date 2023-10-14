import { mongooseConnect } from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { CustomerAddress } from "@/models/CustomerAddress";

export default async function handle(req, res) {
    await mongooseConnect()
    const {user} = await getServerSession(req, res, authOptions)

    if(req.method === 'PUT'){
        const { address, newAddress } = req.body
        const addressDocument = await CustomerAddress.findOneAndUpdate(
            {
                userEmail: user.email,
                address: address
            },
            {
                address: newAddress
            },
            {
                new: true
            }
        )
        if(addressDocument){
            res.json(addressDocument)
        }
        else{
            res.json(await CustomerAddress.create({userEmail:user.email, ...req.body}))
        }
    }

    if(req.method === 'GET'){
        const { newAddress } = req.query
        if(newAddress){
            const address = await CustomerAddress.findOne({userEmail:user.email, address:newAddress})
            res.json(address)
        }
        else{
            const address = await CustomerAddress.find({userEmail:user.email})
            res.json(address)
        }
    }

    if(req.method === 'DELETE'){
        const { addressToDelete } = req.query
        const addressDocument = await CustomerAddress.findOneAndDelete({userEmail:user.email, address:addressToDelete})
        res.json(addressDocument)
    }
}