import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { CartContext } from "./CartContext"
import SearchIcon from "./icons/SearchIcon"
import { useSession } from "next-auth/react"
export default function Header(){
    const {data:session} = useSession()
    const {cartProducts} = useContext(CartContext)
    
    return(
        <header className="bg-[#FFA07A] sticky top-0 z-[1090]">
            <div className="flex justify-between items-center py-[15px] px-0 mx-[100px] overflow-hidden">
                <Link className="bg-white px-5 py-2 rounded-md" href={'/'}><img className="max-w-[200px]" src="/images/template/logo.png"></img></Link>
                <nav className="flex gap-5 items-center">
                    <Link className="text-xl rounded-lg px-5 py-3 hover:bg-white hover:text-[#f78c94]" href={'/'}>Home</Link>
                    <Link className="text-xl rounded-lg px-5 py-3 hover:bg-white hover:text-[#f78c94]" href={'/products'}>Menu</Link>
                    <Link className="text-xl rounded-lg px-5 py-3 hover:bg-white hover:text-[#f78c94]" href={'/categories'}>Categories</Link>
                    <Link className="text-xl rounded-lg px-5 py-3 hover:bg-white hover:text-[#f78c94]" href={'/account'}>Account</Link>
                    <Link className="text-xl rounded-lg px-5 py-3 hover:bg-white hover:text-[#f78c94] relative" href={'/cart'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <div className="absolute top-[-5px] right-[-5px] w-[30px] h-[30px] bg-sky-500 rounded-full">
                            <p className="text-white text-center text-[17px]">{cartProducts.length}</p>
                        </div>
                    </Link>
                    <Link className="text-xl rounded-lg px-5 py-3 hover:bg-white hover:text-[#f78c94]" href={'/search'}><SearchIcon /></Link>
                    {session && (
                        <div>
                            <img className="max-w-[50px] rounded-full ml-2" src={session.user.image}></img>
                        </div>
                    )}
                    {!session && (
                        <img className="max-w-[50px] rounded-full" src="../images/profile/default.png"></img>
                    )}     
                </nav>
            </div>
        </header>
    )
}