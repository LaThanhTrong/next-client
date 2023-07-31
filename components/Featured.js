import { useContext, useRef, useEffect } from "react";
import Center from "./Center";
import Link from "next/link";
import { CartContext } from "./CartContext";
import { RevealWrapper } from "next-reveal";

export default function Featured({product}){
    const {addProduct} = useContext(CartContext)
    const imgRef = useRef()
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

    useEffect(() => {
        const interval = setInterval(() => {
            const reveal = imgRef.current?.closest('div[data-sr-id]')
            if(reveal?.style.opacity === '1'){
                reveal.style.transform = 'none'
            }
        }, 100)
        return () => clearInterval(interval)
    },[])

    function addFeaturedToCart(){
        addProduct(product._id)
    }

    return(
        <div className="bg-[#fff9f6] py-[50px] px-0">
            <Center>
                <div className="grid grid-cols-2 gap-[40px]">
                    <div className="flex items-center">
                        <div>
                            <RevealWrapper origin={'left'} delay={0}>
                                <h1 className="font-bold text-[3rem]">{product.title}</h1>
                                <h2 className="font-bold text-[2rem]">Order Your Best Food At Any Time</h2>
                                <p className="text-gray-600 text-[1rem]">Hey, Our delicious foods are waiting for you. We are always near to you with fresh and highest quality item of foods</p>
                                <div className="flex gap-3 mt-7">
                                    <Link href={`/product/${product._id}`} className="bg-transparent border-2 border-black rounded-md py-[5px] px-[15px] text-[1.2rem] inline-flex">Read more</Link>
                                    <img className="hidden max-w-[100px] max-h-[100px] opacity-100 fixed z-[5] rounded-sm" src={product.images[0]} ref={imgRef} style={{animation: 'fly 1s'}} />
                                    <button onClick={ev => {addFeaturedToCart(); sendImageToCart(ev)}} className="bg-[#FFA07A] border-2 border-[#FFA07A] text-white rounded-md py-[5px] px-[15px] text-[1.2rem] inline-flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-[20px] mr-1">
                                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                                    </svg>
                                        Add to Cart</button>
                                </div>
                            </RevealWrapper>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <RevealWrapper delay={0}>
                            <img className="max-w-[100%] h-[300px] w-auto z-0 rounded-full" src={product.images?.[0]} alt="" />
                        </RevealWrapper>
                    </div>
                </div>
            </Center>
        </div>
    )
}