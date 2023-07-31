import Center from "@/components/Center";
import ProductImages from "@/components/ProductImages";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { CartContext } from "@/components/CartContext";
import { useContext } from "react";
import FlyingButton from "@/components/FlyingButton";
import ProductReviews from "@/components/ProductReviews";
import { Category } from "@/models/Category";
import { Roboto } from 'next/font/google'
import { Quicksand } from 'next/font/google'

const rbt = Roboto({ subsets: ['latin'], weight: '400' })
const qs = Quicksand({ subsets: ['latin'], weight: '700' })

export default function ProductPage({product, categ}){
    const categoriesToFill = []
    if(categ){
        if(categ.length > 0 && product.category){
            let catInfo = categ.find(({_id}) => _id === product.category);
            categoriesToFill.push(catInfo.name);
            while(catInfo?.parent?._id) {
                const parentCat = categ.find(({_id}) => _id === catInfo?.parent?._id)
                categoriesToFill.push(parentCat.name)
                catInfo = parentCat
            }
        }
    }
    const {addProduct} = useContext(CartContext)
    return(
        <>
            <Center>
                <div className="grid gap-[40px] mt-[40px]" style={{gridTemplateColumns: '.8fr 1.2fr'}}>
                    <div className="bg-[#fff] rounded-sm p-[30px] pt-[10px]">
                        <ProductImages images={product.images}></ProductImages>
                    </div>
                    <div>
                        <h1 className="mb-8 font-bold text-[2rem]">{product.title}</h1>
                        <p className={rbt.className+" text-base"}>{product.description}</p>
                        <div className="flex gap-5 items-center mt-7">
                            <div className={qs.className+" text-xl"}>đ{product.price.toLocaleString()}</div>
                            <FlyingButton src={product.images?.[0]} flyingItemStyling={{
                                    width: 'auto',
                                    height: 'auto',
                                    maxHeight: '100px',
                                    maxWidth: '100px',
                            }} targetTop={'5%'} targetLeft={'95%'}>
                                <div className="flex gap-3">
                                    <div onClick={() => addProduct(product._id)} className="bg-[#FFA07A] border-2 border-[#FFA07A] text-white rounded-md py-[5px] px-[15px] text-[1.2rem] inline-flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-[20px] mr-1">
                                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                                    </svg>
                                    Add to Cart</div>
                                </div>
                            </FlyingButton>
                        </div>
                        <br />
                        <span>Tag: </span>
                        {categoriesToFill.map((cat, index) => (
                            <span key={index}>
                                {index+1 === categoriesToFill.length ? <>{cat}.</> : <>{cat}, </>}
                            </span>
                        ))}
                    </div>
                </div>
                <ProductReviews product={product}></ProductReviews>
            </Center>
        </>
    )
}

export async function getServerSideProps(context){
    await mongooseConnect()
    const {id} = context.query
    const product = await Product.findById(id);
    const categ = await Category.find().populate('parent')
    return {
        props:{
            product: JSON.parse(JSON.stringify(product)),
            categ: JSON.parse(JSON.stringify(categ)),
        }
    }
}