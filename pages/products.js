import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Inventory } from "@/models/Inventory";
import ProductBox from "@/components/ProductBox";
import { RevealWrapper } from "next-reveal";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Category } from "@/models/Category";

export default function ProductsPage({inventory, wishedProducts=[], categ}){
    return (
        <>
            <Center>
                <div className="bg-[#f8fafc] py-10 px-5 my-10 rounded-md">
                    <h1 className="font-bold text-[2rem]">All products</h1>
                    <div className="grid grid-cols-4 gap-10 pt-[30px]">
                        {inventory.map((i,index) => (
                            <RevealWrapper key={i._id} delay={index*50}>
                                <ProductBox key={i.product._id} {...i.product} inventoryId={i._id} quantity={i.quantity} price={i.price} wished={wishedProducts.includes(i._id)} categ={categ}></ProductBox>
                            </RevealWrapper>
                        ))}
                    </div>
                </div>
            </Center>
        </>
    )
}

export async function getServerSideProps(ctx){
    await mongooseConnect()
    const inventory = await Inventory.find({}, null, {sort: {'_id':-1}}).populate('product')
    const categ = await Category.find().populate('parent')
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    const wishedProducts = session?.user ? await WishedProduct.find({
        userEmail: session.user.email,
        inventory: inventory.map(i => i._id.toString()),
    }) : []
    return {
        props:{
            inventory: JSON.parse(JSON.stringify(inventory)),
            wishedProducts: wishedProducts.map(i => i.inventory.toString()),
            categ: JSON.parse(JSON.stringify(categ)),
        }
    }
}