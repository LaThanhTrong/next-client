import Center from "@/components/Center";
import ProductBox from "@/components/ProductBox";
import Spinner from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import axios from "axios";
import { signOut, signIn, useSession } from "next-auth/react"
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import SingleOrder from "@/components/SingleOrder";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import ReactPaginate from "react-paginate";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFFile from "@/components/Invoices";

export default function AccountPage({categ}){
    const {data:session} = useSession()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [addressLoaded,setAddressLoaded] = useState(true);
    const [wishlistLoaded,setWishlistLoaded] = useState(true);
    const [orderLoaded,setOrderLoaded] = useState(true);
    const [wishedProducts, setWishedProducts] = useState([])
    const [activeTab, setActiveTab] = useState('Orders');
    const [orders, setOrders] = useState([]);
    const itemsPerPageOrder = 5
    const itemsPerPageWishList = 4

    const [itemOffsetOrder, setItemOffsetOrder] = useState(0);
    const endOffsetOrder = itemOffsetOrder + itemsPerPageOrder;
    const currentOrderItems = orders.slice(itemOffsetOrder, endOffsetOrder);
    const pageOrderCount = Math.ceil(orders.length / itemsPerPageOrder);

    const handlePageOrderClick = (event) => {
        const newOffset = (event.selected * itemsPerPageOrder) % orders.length;
        setItemOffsetOrder(newOffset);
    };

    const [itemOffsetWishList, setItemOffsetWishList] = useState(0);
    const endOffsetWishList = itemOffsetWishList + itemsPerPageWishList;
    const currentWishListItems = wishedProducts.slice(itemOffsetWishList, endOffsetWishList);
    const pageWishListCount = Math.ceil(wishedProducts.length / itemsPerPageWishList);

    const handlePageWishListClick = (event) => {
        const newOffset = (event.selected * itemsPerPageWishList) % wishedProducts.length;
        setItemOffsetWishList(newOffset);
    };

    async function logout(){
        await signOut({
            callbackUrl: process.env.NEXT_PUBLIC_URL
        })
    }
    async function loginGoogle(){
        await signIn('google')
    }

    async function loginFacebook(){
        await signIn('facebook')
    }

    function saveAddress(){
        const data = {name,email,address,phoneNumber}
        axios.put('/api/address', data).then(res=>{
            alert('Account updated successfully!')
        })
    }
    useEffect(()=>{
        if(!session){
            return
        }
        setAddressLoaded(false);
        setWishlistLoaded(false);
        axios.get('/api/address').then(response=>{
            setName(response.data?.name)
            setEmail(response.data?.email)
            setAddress(response.data?.address)
            setPhoneNumber(response.data?.phoneNumber)
            setAddressLoaded(true);
        })
        axios.get('/api/wishlist').then(response => {
            setWishedProducts(response.data.map(wp => wp.product))
            setWishlistLoaded(true);
        })
        axios.get('/api/orders').then(response => {
            setOrders(response.data.sort((a,b) => a.createdAt > b.createdAt ? -1 : 1))
            setOrderLoaded(true)
        })
    },[session])

    useEffect(()=>{
        if(activeTab === 'WishList'){
            setItemOffsetOrder(0)
        }
        else if(activeTab === 'Orders'){
            setItemOffsetWishList(0)
        }
    },[activeTab])

    function productRemovedFromWishlist(idToRemove) {
        setWishedProducts(products => {
          return [...products.filter(p => p._id.toString() !== idToRemove)];
        });
    }

    return(
        <>
            <Center>
                <div className="grid gap-[40px] mt-[40px]" style={{gridTemplateColumns: '1.3fr 0.7fr'}}>
                    <div>
                        <RevealWrapper delay={0}>
                            <div className="bg-[#fff] rounded-sm p-[30px]">
                                <Tabs tabs={['Orders','WishList']} active={activeTab} onChange={setActiveTab}></Tabs>
                                {activeTab === 'Orders' && (
                                    <>
                                        {!orderLoaded && (
                                            <Spinner fullWidth={true}></Spinner>
                                        )}
                                        {orderLoaded && (
                                            <div className="w-full mt-5">
                                                {currentOrderItems.length === 0 && (
                                                    <img className="mx-auto" src="/images/template/empty_order.png"></img>
                                                )}
                                                {currentOrderItems.length > 0 && (
                                                    <>
                                                        {currentOrderItems.map((o,i) => (
                                                            <div key={i} className="flex items-center justify-between border-b-[1px] border-b-[#dadee2]">
                                                                <SingleOrder {...o}></SingleOrder>
                                                                <PDFDownloadLink document={<PDFFile order={o} />} fileName="invoice">
                                                                    {({loading}) => (loading ? <Spinner fullWidth={true}></Spinner> : <button className="border-2 border-[#dadee2] text-[#786d7b] flex items-center gap-2 px-3 py-2 rounded-md"><img className="w-6 h-6" src="/images/template/pdf.png"></img>Download</button> )}
                                                                </PDFDownloadLink>
                                                            </div>
                                                        ))}
                                                        <div className="mt-3 text-center ml-[-4px]">
                                                            <ReactPaginate
                                                                marginPagesDisplayed={3}
                                                                breakLabel="..."
                                                                nextLabel=">"
                                                                onPageChange={handlePageOrderClick}
                                                                pageRangeDisplayed={3}
                                                                pageCount={pageOrderCount}
                                                                previousLabel="<"
                                                                renderOnZeroPageCount={null}
                                                                containerClassName={'pagination flex'}
                                                                activeLinkClassName={'active'}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                                {activeTab === 'WishList' && (
                                    <>
                                        {!wishlistLoaded && (
                                            <Spinner fullWidth={true}></Spinner>
                                        )}
                                        {wishlistLoaded && (
                                            <>
                                                {currentWishListItems.length > 0 && (
                                                    <>
                                                        <div className="grid gap-[40px]" style={{gridTemplateColumns: '1fr 1fr'}}>
                                                            {currentWishListItems.map((wp,index) => (
                                                                <div key={index} className="border-2 border-[#edeaea] rounded-md">
                                                                    <ProductBox key={wp._id} {...wp} wished={true} onRemoveFromWishlist={productRemovedFromWishlist} categ={categ}></ProductBox>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mt-3 text-center ml-[-4px]">
                                                            <ReactPaginate
                                                                marginPagesDisplayed={3}
                                                                breakLabel="..."
                                                                nextLabel=">"
                                                                onPageChange={handlePageWishListClick}
                                                                pageRangeDisplayed={3}
                                                                pageCount={pageWishListCount}
                                                                previousLabel="<"
                                                                renderOnZeroPageCount={null}
                                                                containerClassName={'pagination flex'}
                                                                activeLinkClassName={'active'}
                                                            />
                                                        </div>
                                                    </>
                                                    
                                                )}
                                                {currentWishListItems.length === 0 && (
                                                    <img className="mx-auto w-[400px] h-auto" src="/images/template/empty_wishlist.png"></img>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </RevealWrapper>
                    </div>
                    <div>
                        <RevealWrapper delay={100}>
                            <div className="bg-[#fff] rounded-sm p-[30px]">
                                <h2 className="font-bold text-[2rem] mb-4">{session ? 'Personal info' : 'Please login to continue'}</h2>
                                {!addressLoaded && (
                                    <Spinner fullWidth={true}></Spinner>
                                )}
                                {addressLoaded && session && (
                                    <>
                                        <h3 className="text-[#505562]">Full name</h3>
                                        <input className="w-full p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" type="text" placeholder="Name" name="name" value={name} onChange={ev => setName(ev.target.value)}></input>
                                        <h3 className="text-[#505562]">Email</h3>
                                        <input className="w-full p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" type="email" placeholder="Email" name="email" value={email} onChange={ev => setEmail(ev.target.value)}></input>
                                        <h3 className="text-[#505562]">Address</h3>
                                        <input className="w-full p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" type="text" placeholder="Address" name="address" value={address} onChange={ev => setAddress(ev.target.value)}></input>
                                        <h3 className="text-[#505562]">Phone number</h3>
                                        <input className="w-full p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" type="text" placeholder="Phone Number" name="phoneNumber" value={phoneNumber} onChange={ev => setPhoneNumber(ev.target.value)}></input>
                                        <button onClick={saveAddress} className="bg-[#FFA07A] border-2 border-[#FFA07A] text-white rounded-md py-[5px] px-[15px] text-[1rem] inline-flex items-center w-full justify-center mb-4 mt-2">Save</button>
                                        <hr />
                                    </>
                                )}
                                {session && (
                                        <button className="flex items-center gap-2 bg-[#4f46e5] text-white my-4 px-4 py-3 rounded-md float-right" onClick={logout}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                            </svg>
                                            Sign Out
                                        </button>
                                )}
                                {!session && (
                                    <>
                                        <button className="w-full text-gray-500 shadow-md flex items-center justify-center gap-4 text-lg py-3 rounded-sm" onClick={loginGoogle}>
                                            <img className="w-10 h-auto" src="/images/template/google.png"></img>
                                            Sign in with Google
                                        </button><br />
                                        <button onClick={loginFacebook} className="w-full bg-[#2b77f2] text-white shadow-md flex items-center justify-center gap-4 text-lg py-3 rounded-sm">
                                            <img className="w-10 h-auto bg-[#2b77f2]" src="/images/template/facebook2.png"></img>
                                            Sign in with Facebook
                                        </button>
                                    </>
                                )}
                            </div>
                        </RevealWrapper>
                    </div>
                </div>
            </Center>
        </>
    )
}

export async function getServerSideProps(){
    await mongooseConnect()
    const categ = await Category.find().populate('parent')
    return {
        props: {
            categ: JSON.parse(JSON.stringify(categ)),
        }
    }
}