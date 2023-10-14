import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { RevealWrapper } from "next-reveal";
import { useSession } from "next-auth/react";
import { Quicksand } from 'next/font/google'
import Swal from 'sweetalert2'

const qs = Quicksand({ subsets: ['latin'] })

export default function CartPage(){
    const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext)
    const [inventory, setInventory] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [listAddress, setListAddress] = useState([])
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isSuccess,setIsSuccess] = useState(false)
    const {data:session} = useSession()
    const [shippingFee, setShippingFee] = useState(null)

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/cart', {ids:cartProducts})
            .then(response => {
              setInventory(response.data);
            })
        } else {
            setInventory([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window === 'undefined') {
          return;
        }
        if (window?.location.href.includes('success')) {
          setIsSuccess(true);
          clearCart();
        }
        axios.get('/api/settings?name=shippingFee').then(res => {
            setShippingFee(res.data.value)
        })
      }, []);

    useEffect(() => {
        if(!session){
            return
        }
        axios.get('/api/address').then(response => {
            setName(response.data?.name)
            setEmail(response.data?.email)
            setPhoneNumber(response.data?.phoneNumber)
        })
        axios.get('/api/customeraddress').then(response=>{
            setListAddress(response.data.map(ad => ad.address))
            setAddress(response.data[0]?.address)
        })
    }, [session])

    function moreOfThisProduct(id){
        addProduct(id)
    }

    function lessOfThisProduct(id){
        removeProduct(id)
        //Note: this 1 product is stored from localStorage, the product will keep show up whether page is refresh.
        if(cartProducts.length <= 1){
            localStorage.clear('cart')
        }
    }

    async function goToPayment(){
        if(name === ""){
            document.getElementById("nameError").style.display = "block"
        }
        else if(email === ""){
            document.getElementById("emailError").style.display = "block"
        }
        else if(address === ""){
            document.getElementById("addressError").style.display = "block"
        }
        else if(phoneNumber === ""){
            document.getElementById("phoneError").style.display = "block"
        }
        else{
            if(session){
                axios.put('/api/customeraddress', {address}).then(response => {
                    axios.get('/api/customeraddress').then(response=>{
                        setListAddress(response.data.map(ad => ad.address))
                    })
                })
            }
            let data = []
            let string = ""
            let flag = false
            await axios.post('/api/cart', {ids:cartProducts}).then(response => {
                data = response.data
            })
            data.map(product => {
                if(product.quantity === 0){
                    flag = true
                    string += product.title + " is out of stock.\n"
                }
                else if(product.quantity < cartProducts.filter(id => id === product._id)?.length){
                    flag = true
                    string += product.title + " only has " + product.quantity + " left.\n"
                }
            })
            if(flag){
                Swal.fire({
                    title: 'Oops, Cart error!',
                    html: `<pre style="font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; font-size:20px; line-height:130%";>${string} <h2 style="font-weight:bold; font-size:22px;">Please remove them and try again.<h2></pre>`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
            else{
                const response = await axios.post('/api/checkout',{
                    name,email,address,phoneNumber,
                    cartProducts,
                })
                if(response.data.url){
                    window.location = response.data.url
                }
            }
        }
    }

    let productsTotal = 0
    for(const inventoryId of cartProducts){
        const price = inventory.find(p => p._id === inventoryId)?.price || 0
        productsTotal += price
    }

    if(isSuccess){
        return(
            <>
                <Center>
                    <div className="grid gap-10 mt-[40px]" style={{gridTemplateColumns: '1.3fr 0.7fr'}}>
                        <div className="bg-[#fff] rounded-sm p-[30px]">
                            <h1>Thanks for your order!</h1>
                            <p>We will email you when your order will be sent.</p>
                        </div>
                    </div>
                </Center>
            </>
        )
    }

    return(
        <>
        <Center>
            <div className="grid gap-10 mt-[40px]" style={{gridTemplateColumns: '1.3fr 0.7fr'}}>
                <RevealWrapper delay={0}>
                    <div className="bg-[#fff] rounded-sm p-[30px]">
                        <h2 className="font-bold text-[2rem] mb-4">Cart</h2>
                        {!cartProducts?.length && (
                            <div className="">
                                <img className="max-w-full" src="/images/template/empty_cart.png"></img>
                            </div>
                        )}
                        {inventory?.length > 0 && (
                            <table className="w-full table-fixed">
                                <thead>
                                    <tr>
                                        <th className="text-gray-500 text-left">Product</th>
                                        <th className="text-gray-500 text-center">Quantity</th>
                                        <th className="text-gray-500 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map(i => (
                                        <tr key={i._id}>
                                            <td className="py-[10px] px-0 border-t-[1px] border-gray-300">
                                                <div className="w-[100px] h-[100px] p-[10px] rounded-sm flex items-center justify-center">
                                                    <img className="max-w-[80px] max-h-[80px]" src={i.product.images[0]}></img>
                                                </div>
                                                <p className="text-sm">{i.product.title}</p>
                                            </td>
                                            <td className="border-t-[1px] border-gray-300">
                                                <div className="flex justify-center items-center gap-1">
                                                    <button onClick={() => lessOfThisProduct(i._id)} className="bg-gray-200 rounded-md py-0 px-[15px] text-[1rem] mr-2">-</button>
                                                    <div className={qs.className+" font-[600]"}>{cartProducts.filter(id => id === i._id).length}</div>
                                                    <button onClick={() => moreOfThisProduct(i._id)} className="bg-gray-200 rounded-md py-0 px-[15px] text-[1rem] ml-2">+</button>
                                                </div>
                                                
                                            </td>
                                            <td className={qs.className+" border-t-[1px] border-gray-300 text-right text-base font-[600]"}>
                                                đ{(cartProducts.filter(id => id === i._id).length * i.price).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="text-xl pt-8 pb-3" colSpan={2}>Products</td>
                                        <td className={qs.className+" text-right text-xl pt-8 pb-3 font-[600]"}>đ{productsTotal.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-xl py-3" colSpan={2}>Shipping</td>
                                        <td className={qs.className+" text-right text-xl py-3 font-[600]"}>đ{parseInt(shippingFee || 0).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-2xl py-3" colSpan={2}>Total</td>
                                        <td className={qs.className+" text-right font-bold text-2xl py-3"}>đ{(productsTotal+Number(shippingFee)).toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </RevealWrapper>
                {!!cartProducts?.length && (
                    <RevealWrapper delay={100}>
                        <div className="bg-[#fff] rounded-sm p-[30px]">
                            <h2 className="font-bold text-[1.5rem] mb-4">Order Information</h2>
                            <input id="name" className="w-full p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" type="text" placeholder="Name" name="name" value={name} onChange={ev => setName(ev.target.value)}></input>
                            <p id="nameError" className="mb-2 text-rose-500 hidden">Name field is required!</p>
                            <input id="email" className="w-full p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" type="email" placeholder="Email" name="email" value={email} onChange={ev => setEmail(ev.target.value)}></input>
                            <p id="emailError" className="mb-2 text-rose-500 hidden">Email field is required!</p>
                            <div className="flex items-center gap-2">
                                <input id="address" className="w-full p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" type="text" placeholder="Address" name="address" value={address} onChange={ev => setAddress(ev.target.value)}></input>
                                <select className="w-[35%] h-11 p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" value={address} onChange={ev => setAddress(ev.target.value)}>
                                    {listAddress.map((ad,index) => (
                                        <option key={index} value={ad}>{ad}</option>
                                    ))}
                                </select>
                            </div>
                            <p id="addressError" className="mb-2 text-rose-500 hidden">Address field is required!</p>
                            <input id="phone" className="w-full p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" type="text" placeholder="Phone Number" name="phoneNumber" value={phoneNumber} onChange={ev => setPhoneNumber(ev.target.value)}></input>
                            <p id="phoneError" className="mb-2 text-rose-500 hidden">Phone field is required!</p>
                            <div className="flex gap-3 mt-2">
                                <button onClick={goToPayment} className="bg-[#FFA07A] border-2 border-[#FFA07A] text-white rounded-md py-[5px] px-[15px] text-[1rem] inline-flex items-center w-full justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-[20px] mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                </svg>
                                    Continue to Payment</button>
                            </div>
                        </div>
                    </RevealWrapper>
                )}
            </div>
        </Center>
    </>
    )
}
