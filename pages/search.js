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
import { Inventory } from "@/models/Inventory";


export default function SearchPage({wishedProducts=[], categ}){
    const [phrase, setPhrase] = useState('')
    const [inventory, setInventory] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const debouncedSearch = useCallback(debounce(searchProducts, 500), [])
    const [wish, setWish] = useState(wishedProducts)
    
    useEffect(() => {
        if(phrase.length > 0){
            setIsLoading(true)
            debouncedSearch(phrase)
        }
        else{
            setInventory([])
        }
        axios.get('/api/wishlist').then(response => {
            setWish(response.data.map(wp => wp.inventory._id))
        })
    }, [phrase])

    function searchProducts(phrase){
        axios.get('/api/inventory?phrase='+encodeURIComponent(phrase)).then(response => {
            console.log(response.data)
            setInventory(response.data)
            setIsLoading(false)
        })
    }
    return (
        <>
            <Center>
                <div className="sticky z-10 top-[120px] bg-[#eeeeeeaa] p-4">
                    <input autoFocus value={phrase} onChange={ev => setPhrase(ev.target.value)} className="px-3 py-2 text-xl rounded-sm w-full border-2 border-gray-400" type="text" placeholder="Search for products or descriptions..."></input>
                </div>
                {!isLoading && phrase !== '' && inventory.length === 0 && (
                    <h2 className="px-4 py-8">No products found for item {phrase}</h2>
                )}
                {isLoading && (
                    <div className="py-8">
                        <Spinner fullWidth={true}></Spinner>
                    </div>
                )}
                {!isLoading && inventory.length > 0 && (
                    <div className="grid grid-cols-4 gap-10 px-4 py-8">{inventory?.length > 0 && inventory.map((i,index) => (
                        <RevealWrapper key={i._id} delay={index*50}>
                            <ProductBox key={i.product._id} {...i.product} inventoryId={i._id} quantity={i.quantity} price={i.price} wished={wishedProducts.includes(i._id)} categ={categ}></ProductBox>
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
    const inventory = await Inventory.find({}, null, {sort: {'_id':-1}}).populate('product');
    const categ = await Category.find().populate('parent')
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    const wishedProducts = session?.user ? await WishedProduct.find({
      userEmail: session.user.email,
      product: inventory.map(p => p._id.toString()),
    }) : []
    return {
        props:{
            wishedProducts: wishedProducts.map(i => i.inventory.toString()),
            categ: JSON.parse(JSON.stringify(categ)),
        }
    }
}