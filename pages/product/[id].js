import Center from "@/components/Center";
import ProductImages from "@/components/ProductImages";
import { mongooseConnect } from "@/lib/mongoose";
import { CartContext } from "@/components/CartContext";
import { useContext, useRef } from "react";
import ProductReviews from "@/components/ProductReviews";
import { Category } from "@/models/Category";
import { Roboto } from 'next/font/google'
import { Quicksand } from 'next/font/google'
import Swal from 'sweetalert2'
import { Inventory } from "@/models/Inventory";

const rbt = Roboto({ subsets: ['latin'], weight: '400' })
const qs = Quicksand({ subsets: ['latin'], weight: '700' })

export default function ProductPage({inventory, categ}){
    const categoriesToFill = []
    const imgRef = useRef()
    if(categ){
        if(categ.length > 0 && inventory.product.category){
            let catInfo = categ.find(({_id}) => _id === inventory.product.category);
            categoriesToFill.push(catInfo.name);
            while(catInfo?.parent?._id) {
                const parentCat = categ.find(({_id}) => _id === catInfo?.parent?._id)
                categoriesToFill.push(parentCat.name)
                catInfo = parentCat
            }
        }
    }
    const {addProduct} = useContext(CartContext)

    function sendImageToCart(ev){
        imgRef.current.style.display = 'inline-block'
        imgRef.current.style.left = (ev.clientX-50) + 'px'
        imgRef.current.style.top = (ev.clientY-50) + 'px'
        setTimeout(() => {
            try{
                imgRef.current.style.display = 'none'
            }catch(e){
                return
            }
        }, 700)
    }

    function add(ev){
        if(inventory.quantity === 0){
            Swal.fire({
                title: 'Out of stock',
                text: 'This product is out of stock',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
        else{
            sendImageToCart(ev)
            addProduct(inventory._id)
        }
    }

    return(
        <>
            <Center>
                <div className="grid gap-[40px] mt-[40px]" style={{gridTemplateColumns: '.8fr 1.2fr'}}>
                    <div className="bg-[#fff] rounded-sm p-[30px] pt-[10px]">
                        <ProductImages images={inventory.product.images}></ProductImages>
                    </div>
                    <div>
                        <h1 className="mb-8 font-bold text-[2rem]">{inventory.product.title}</h1>
                        <p className={rbt.className+" text-base"}>{inventory.product.description}</p>
                        <p className={"text-xl font-bold mt-5"}>In Stocks: <span className="font-normal">{inventory.quantity}</span></p>
                        <div className="flex gap-5 items-center mt-5 cursor-pointer">
                            <div className={qs.className+" text-xl"}>đ{inventory.price.toLocaleString()}</div>
                            <div className="flex gap-3">
                                <img className="hidden max-w-[100px] max-h-[100px] opacity-100 fixed z-[5] rounded-sm" src={inventory.product.images[0]} ref={imgRef} style={{animation: 'fly 1s'}} />
                                <div onClick={ev => add(ev)} className="bg-[#FFA07A] border-2 border-[#FFA07A] text-white rounded-md py-[5px] px-[15px] text-[1.2rem] inline-flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-[20px] mr-1">
                                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                                </svg>
                                Add to Cart</div>
                            </div>
                        </div>
                        <br />
                        <span className="text-xl font-bold">Tag: </span>
                        {categoriesToFill.map((cat, index) => (
                            <span key={index} className="text-xl">
                                {index+1 === categoriesToFill.length ? <>{cat}.</> : <>{cat}, </>}
                            </span>
                        ))}
                    </div>
                </div>
                <ProductReviews inventoryId={inventory._id}></ProductReviews>
            </Center>
        </>
    )
}

export async function getServerSideProps(context){
    await mongooseConnect()
    const {id} = context.query
    const inventory = await Inventory.findOne({_id: id}).populate('product')
    const categ = await Category.find().populate('parent')
    return {
        props:{
            inventory: JSON.parse(JSON.stringify(inventory)),
            categ: JSON.parse(JSON.stringify(categ)),
        }
    }
}