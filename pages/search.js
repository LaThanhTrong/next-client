import Center from "@/components/Center";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { RevealWrapper } from "next-reveal";
import ProductBox from "@/components/ProductBox";
import { debounce } from "lodash";
import Spinner from "@/components/Spinner";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default function SearchPage({categ}){
    const [phrase, setPhrase] = useState('')
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const debouncedSearch = useCallback(debounce(searchProducts, 500), [])
    const [wish, setWish] = useState([])
    useEffect(() => {
        if(phrase.length > 0){
            setIsLoading(true)
            debouncedSearch(phrase)
        }
        else{
            setProducts([])
        }
        axios.get('/api/wishlist').then(response => {
            console.log(response.data.map(wp => wp.product._id))
            setWish(response.data.map(wp => wp.product._id))
        })
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
                            <ProductBox key={product._id} {...product} wished={wish.includes(product._id)} categ={categ}></ProductBox>
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
    const categ = await Category.find().populate('parent')
    return {
        props:{
            categ: JSON.parse(JSON.stringify(categ)),
        }
    }
}