import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductBox from "@/components/ProductBox";
import { RevealWrapper } from "next-reveal";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Category } from "@/models/Category";

export default function ProductsPage({products, wishedProducts=[], categ}){
    return (
        <>
            <Center>
                <div className="bg-[#f8fafc] py-10 px-5 my-10 rounded-md">
                    <h1 className="font-bold text-[2rem]">All products</h1>
                    <div className="grid grid-cols-4 gap-10 pt-[30px]">{products?.length > 0 && products.map((product,index) => (
                    <RevealWrapper key={product._id} delay={index*50}>
                        <ProductBox key={product._id} {...product} wished={wishedProducts.includes(product._id)} categ={categ}></ProductBox>
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
    const products = await Product.find({}, null, {sort: {'_id':-1}});
    const categ = await Category.find().populate('parent')
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    const wishedProducts = session?.user ? await WishedProduct.find({
      userEmail: session.user.email,
      product: products.map(p => p._id.toString()),
    }) : []
    return {
        props:{
            products: JSON.parse(JSON.stringify(products)),
            wishedProducts: wishedProducts.map(i => i.product.toString()),
            categ: JSON.parse(JSON.stringify(categ)),
        }
    }
}