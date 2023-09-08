import Link from "next/link"
import { useContext, useEffect, useRef, useState } from "react"
import { CartContext } from "./CartContext"
import HeartOutlineIcon from "./icons/HeartOutlineIcon"
import HeartSolidIcon from "./icons/HeartSolidIcon"
import axios from "axios"
import { useSession } from "next-auth/react";
import { Quicksand } from 'next/font/google'
const qs = Quicksand({ subsets: ['latin'] })
import Swal from 'sweetalert2'

export default function ProductBox({_id, title, description, quantity, price, images, category, categ, wished=false, onRemoveFromWishlist=()=>{}}){
    const [swalProps, setSwalProps] = useState({});
    const categoriesToFill = []
    if(categ){
        if(categ.length > 0 && category){
            let catInfo = categ.find(({_id}) => _id === category);
            categoriesToFill.push(catInfo.name);
            while(catInfo?.parent?._id) {
                const parentCat = categ.find(({_id}) => _id === catInfo?.parent?._id)
                categoriesToFill.push(parentCat.name)
                catInfo = parentCat
            }
        }
    }

    const {addProduct} = useContext(CartContext)
    const url = '/product/'+_id
    const imgRef = useRef()
    const activeClass = "text-red-500"
    const inactiveClass = "text-black"
    const [isWished,setIsWished] = useState(wished);
    const {data:session} = useSession();
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

    function addToWishList(ev){
        ev.preventDefault()
        ev.stopPropagation()
        const nextValue = !isWished;
        if (nextValue === false && onRemoveFromWishlist) {
            onRemoveFromWishlist(_id);
          }
        if(session){
            axios.post('/api/wishlist', {
                product: _id,
            }).then(() => {})
        }
        setIsWished(nextValue)
    }

    function add(ev, _id){
        if(quantity === 0){
            Swal.fire({
                title: 'Out of stock',
                text: 'This product is out of stock',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
        else{
            sendImageToCart(ev)
            addProduct(_id)
        }
    }

    return(
        <>
            <div className="relative">
                {quantity === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img className="w-full h-[40%] z-10" src="images/template/nostock.png" />
                    </div>
                )}
                <div className={quantity != 0 ? "bg-white px-2 pt-5 pb-8 rounded-lg" : "bg-white px-2 pt-5 pb-8 rounded-lg opacity-60"}>
                    <Link href={url} className="h-[200px] text-center flex items-center justify-center rounded-md relative">
                        <div>
                            <button className={`${isWished ? activeClass : inactiveClass}`+` border-0 absolute top-0 left-0 p-[10px]`} onClick={addToWishList}>
                                {isWished ? <HeartSolidIcon></HeartSolidIcon> : <HeartOutlineIcon></HeartOutlineIcon>}
                            </button>
                            <img className="max-w-full max-h-[150px] rounded-full" src={images?.[0]}></img>
                        </div>
                    </Link>
                    <div className="mt-[5px] px-4">
                        {categoriesToFill.map((category, index) => (
                            <span key={index} className="bg-gray-400 mx-[2px] px-2 py-1 text-[12px] text-white rounded-lg">{category}</span>
                        ))}
                
                        <h2 className="mt-2"><Link href={'/product/'+_id} className="font-bold text-[1.1rem] m-0">{title}</Link></h2>
                        <p className="mt-1 text-[#4b5563] text-sm">In Stocks: {quantity}</p>
                        <div className="flex items-center justify-between mt-3 gap-4">
                            <div className={qs.className+" text-[1.1rem] text-emerald-500 font-bold border-2 border-emerald-600 rounded-lg px-2 py-1"}>
                                đ{price.toLocaleString()}
                            </div>

                            <div className={"flex gap-3"} onClick={ev => add(ev, _id)}>
                                <img className="hidden max-w-[100px] max-h-[100px] opacity-100 fixed z-20 rounded-sm" src={images[0]} ref={imgRef} style={{animation: 'fly 1s'}} />
                                <button className={"bg-transparent border-2 border-[#FFA07A] text-[#FFA07A] rounded-md px-[15px] py-[5px] text-[.9rem] inline-flex items-center font-500 font-['Poppins', sans-serif]"}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-[20px] mr-1">
                                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                                </svg>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

