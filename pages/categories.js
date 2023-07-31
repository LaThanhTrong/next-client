import Center from "@/components/Center";
import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductBox from "@/components/ProductBox";
import Link from "next/link";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function CategoriesPage({mainCategories, categoriesProducts, wishedProducts=[], categ}){
    const [selected, setSelected] = useState([])
    const [categoriesSelected, setCategoriesSelected] = useState(categ)

    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5,
          slidesToSlide: 5,
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 4,
          slidesToSlide: 4,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 3,
          slidesToSlide: 3,
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 2,
          slidesToSlide: 2,
        }
    };
    function handleChange(e){
        if(e.target.checked){
            setSelected([...selected, e.target.value])
        }
        else{
            setSelected(selected.filter(s => s !== e.target.value))
        }
    }
    
    useEffect(()=>{
        if(selected.length > 0){
            setCategoriesSelected(categ.filter(c => selected.find(s => s === c.name)))
        }
        else{
            setCategoriesSelected(categ)
        }
    },[selected])

    return (
        <>
            <div className="flex">
                <div className="py-8 px-6">
                    <div className="px-6 py-7 bg-gray-100 rounded-md">
                        <h2 className="font-bold text-[1.5rem] mb-4">Filter categories</h2>
                        {mainCategories.map((category,i) => (
                            <div key={i} className="h-[2.5rem] w-[15em] flex items-center justify-between">
                                <input className="appearance-none h-[1.4em] w-[1.4em] border-2 border-[#d5d5d5] rounded-sm cursor-pointer flex items-center justify-center outline-none after:content-['\2714'] after:font-[900] after:text-[.8em] after:text-white after:hidden checked:bg-black checked:border-black checked:after:block transition-all" id="check" type="checkbox" value={category.name} onChange={handleChange} />
                                <label className="text-[#4c4c4c] text-[1.1em]" htmlFor="check">{category.name}</label>
                            </div>
                        ))}
                    </div> 
                </div>
                <Center>
                    {categoriesSelected.map(category => (
                        <div key={category._id} className="mb-10">
                            <div className="mt-8 pt-7 mb-3 font-bold text-[1.5rem]">
                                {category.name}
                                <span className="font-normal text-[1.1rem] ml-4">
                                    <Link className="underline text-[#555]" href={'/category/'+category._id}>Show all {category.name}</Link>
                                </span>
                            </div>
                            <div className="z-0">
                                <Carousel responsive={responsive}>
                                    {categoriesProducts[category._id].map((p,index) => (
                                        <div key={index} className="border-2 border-[#edeaea] rounded-md mr-7">
                                            <ProductBox key={p._id} {...p} wished={wishedProducts.includes(p._id)} categ={categ}></ProductBox>
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </div>
                    ))}
                </Center>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx){
    await mongooseConnect()
    const categories = await Category.find()
    const categ = await Category.find().populate('parent')
    const mainCategories = categories
    const categoriesProducts = {}
    const allFetchedProductsId = [];
    for(const mainCat of mainCategories){
        const mainCatId = mainCat._id.toString()
        const childCatIds = categories.filter(c => c?.parent?.toString() === mainCatId).map(c => c._id.toString())
        const categoriesIds = [mainCatId, ...childCatIds]
        const products = await Product.find({category: categoriesIds}, null, {sort: {'_id':-1}})
        allFetchedProductsId.push(...products.map(p => p._id.toString()))
        categoriesProducts[mainCat._id] = products
    }
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    const wishedProducts = session?.user ? await WishedProduct.find({
        userEmail: session.user.email,
        product: allFetchedProductsId,
      }) : []
    return {
        props: {
            mainCategories: JSON.parse(JSON.stringify(mainCategories)),
            categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
            wishedProducts: wishedProducts.map(i => i.product.toString()),
            categ: JSON.parse(JSON.stringify(categ)),
        }
    }
}