import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";

export default async function handle(req, res){
    await mongooseConnect()

    if(req.method === 'POST'){
        const {title,description,stars,inventory,userEmail,userName} = req.body;
        res.json(await Review.create({title,description,stars,inventory,userEmail,userName}))
    }

    if(req.method === 'GET'){
        const {inventory} = req.query;
        res.json(await Review.find({inventory}, null, {sort: {createdAt: -1}}))
    }
}