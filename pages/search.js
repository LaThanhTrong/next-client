import Center from "@/components/Center";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { RevealWrapper } from "next-reveal";
import ProductBox from "@/components/ProductBox";
import { debounce } from "lodash";
import Spinner from "@/components/Spinner";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";


export default function SearchPage({wishedProducts=[], categ}){
    const [phrase, setPhrase] = useState('')
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const debouncedSearch = useCallback(debounce(searchProducts, 500), [])
    useEffect(() => {
        if(phrase.length > 0){
            setIsLoading(true)
            debouncedSearch(phrase)
        }
        else{
            setProducts([])
        }
    }, [phrase])
    function searchProducts(phrase){
        axios.get('/api/products?phrase='+encodeURIComponent(phrase)).then(response => {
            setProducts(response.data)
            setIsLoading(false)
        })
    }
    return (
        <>
            <Center>
                <div className="sticky z-10 top-[120px] bg-[#eeeeeeaa] p-4">
                    <input autoFocus value={phrase} onChange={ev => setPhrase(ev.target.value)} className="px-3 py-2 text-xl rounded-sm w-full border-2 border-gray-400" type="text" placeholder="Search for products or descriptions..."></input>
                </div>
                {!isLoading && phrase !== '' && products.length === 0 && (
                    <h2 className="px-4 py-8">No products found for item {phrase}</h2>
                )}
                {isLoading && (
                    <div className="py-8">
                        <Spinner fullWidth={true}></Spinner>
                    </div>
                )}
                {!isLoading && products.length > 0 && (
                    <div className="grid grid-cols-4 gap-10 px-4 py-8">{products?.length > 0 && products.map((product,index) => (
                        <RevealWrapper key={product._id} delay={index*50}>
                            <ProductBox key={product._id} {...product} wished={wishedProducts.includes(product._id)} categ={categ}></ProductBox>
                        </RevealWrapper>
                        ))}
                    </div>
                )}
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
            wishedProducts: wishedProducts.map(i => i.product.toString()),
            categ: JSON.parse(JSON.stringify(categ)),
        }
    }
}