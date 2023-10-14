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
import Swal from 'sweetalert2';
import { Fragment } from "react";

export default function AccountPage({categ}){
    const {data:session} = useSession()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [listAddress, setListAddress] = useState([])
    const [phoneNumber, setPhoneNumber] = useState('')
    const [addressLoaded,setAddressLoaded] = useState(true);
    const [customerAddressLoaded,setCustomerAddressLoaded] = useState(true);
    const [wishlistLoaded,setWishlistLoaded] = useState(true);
    const [orderLoaded,setOrderLoaded] = useState(true);
    const [wishedProducts, setWishedProducts] = useState([])
    const [activeTab, setActiveTab] = useState('Orders');
    const [orders, setOrders] = useState([]);
    const [orderDetail, setOrderDetail] = useState([]);
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

    function saveAddress(){
        document.getElementById("nameError").style.display = "none"
        document.getElementById("emailError").style.display = "none"
        document.getElementById("addressError").style.display = "none"
        document.getElementById("phoneError").style.display = "none"
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
            const data = {name,email,phoneNumber}
            axios.put('/api/address', data).then(response => {
                return axios.put('/api/customeraddress', {address})
            }).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Account Information has been saved',
                    confirmButtonText: 'OK'
                });
                axios.get('/api/customeraddress').then(response=>{
                    setListAddress(response.data.map(ad => ad.address))
                    setAddress(response.data[0]?.address)
                })
            }).catch((error) => {  
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    confirmButtonText: 'OK'
                });
            })
        }
    }
    useEffect(()=>{
        if(!session){
            return
        }
        setAddressLoaded(false);
        setCustomerAddressLoaded(false);
        setOrderLoaded(false);
        setWishlistLoaded(false);
        axios.get('/api/address').then(response=>{
            setName(response.data?.name)
            setEmail(response.data?.email)
            setPhoneNumber(response.data?.phoneNumber)
            setAddressLoaded(true);
        })
        axios.get('/api/customeraddress').then(response=>{
            setListAddress(response.data.map(ad => ad.address))
            setAddress(response.data[0]?.address)
            setCustomerAddressLoaded(true);
        })
        axios.get('/api/wishlist').then(response => {
            setWishedProducts(response.data.map(wp => wp.inventory))
            setWishlistLoaded(true);
        })
        axios.get('/api/orders', {
            params: {
                paid: true
            }
        }).then(response => {
            setOrders(response.data.filter(order => order.paid === true).sort((a,b) => a.createdAt > b.createdAt ? -1 : 1))
            const orderIds = response.data.map(order => order._id)
            if(orderIds.length > 0){
                axios.get('/api/orderdetails?orderIds='+orderIds).then(response => {
                    setOrderDetail(response.data)
                })
            }
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
    
    async function getUpdate(address, newAddress){
        const checkResponse = await axios.get('/api/customeraddress', {params: {newAddress}})
        if(checkResponse.data){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Address "${newAddress}" already exists!`,
                confirmButtonText: 'OK'
            });
            return
        }

        const response = await axios.put('/api/customeraddress', {
            address: address,
            newAddress: newAddress,
        });
        if(response.data){
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Address has been updated',
                confirmButtonText: 'OK',
            });
            const addressesResponse = await axios.get('/api/customeraddress');
            setListAddress(addressesResponse.data.map((ad) => ad.address));
            setAddress(addressesResponse.data[0]?.address);
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                confirmButtonText: 'OK'
            });
        }
    }
    function getRemove(addressToDelete){
        Swal.fire({
            title: 'Delete Address',
            text: `Are you sure you want to delete address "${addressToDelete}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if(result.isConfirmed){
                const response = await axios.delete('/api/customeraddress?addressToDelete='+addressToDelete);
                if(response.data){
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Address has been removed',
                        confirmButtonText: 'OK',
                    });
                    const addressesResponse = await axios.get('/api/customeraddress');
                    setListAddress(addressesResponse.data.map((ad) => ad.address));
                    setAddress(addressesResponse.data[0]?.address);
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        confirmButtonText: 'OK'
                    });
                }
            }
        })
    }
    
    return(
        <>
            <Center>
                <div className="grid gap-[40px] mt-[40px]" style={{gridTemplateColumns: '1.3fr 0.7fr'}}>
                    <div>
                        <RevealWrapper delay={0}>
                            <div className="bg-[#fff] rounded-sm p-[30px]">
                                <Tabs tabs={['Orders','WishList','Addresses']} active={activeTab} onChange={setActiveTab}></Tabs>
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
                                                {currentOrderItems.length > 0 && orderDetail.length > 0 && (
                                                    <>
                                                        {currentOrderItems.map((o,i) => (
                                                            <div key={i} className="flex items-center justify-between border-b-[1px] border-b-[#dadee2]">
                                                                
                                                                <SingleOrder {...o} line_items={orderDetail.filter(od => od.order === o._id)[0].line_items}></SingleOrder>
                                                                <PDFDownloadLink document={<PDFFile order={o} line_items={orderDetail.filter(od => od.order === o._id)[0].line_items} />} fileName="invoice">
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
                                                {currentWishListItems .length > 0 && (
                                                    <>
                                                        <div className="grid gap-[40px]" style={{gridTemplateColumns: '1fr 1fr'}}>
                                                            {currentWishListItems.map((wp,index) => (
                                                                <div key={index} className="border-2 border-[#edeaea] rounded-md">
                                                                    <ProductBox key={wp.product._id} {...wp.product} inventoryId={wp._id} quantity={wp.quantity} price={wp.price} wished={true} onRemoveFromWishlist={productRemovedFromWishlist} categ={categ}></ProductBox>
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
                                {activeTab === 'Addresses' && (
                                    <>
                                        {!customerAddressLoaded && (
                                            <Spinner fullWidth={true}></Spinner>
                                        )}
                                        {customerAddressLoaded && (
                                            <>
                                                <table className="table-auto border-collapse w-full">
                                                    <tbody className="">
                                                        {listAddress.map((ad,index) => {
                                                            let inputValue = ad;
                                                            return (
                                                                <Fragment key={index}>
                                                                    <tr>
                                                                        <td className="pt-2 text-[#505562]">Address {index+1}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="py-2 whitespace-nowrap w-[90%]">
                                                                            <input className="w-full p-3 border-2 border-gray-400 rounded-sm box-border" type="text" placeholder="Address" defaultValue={ad} onChange={(e) => (inputValue = e.target.value)}></input>
                                                                        </td>
                                                                        <td className="pl-4 py-2 whitespace-nowrap">
                                                                            <button className="bg-emerald-400 py-3 px-4 rounded-md text-white" onClick={() => getUpdate(ad, inputValue)}>Update</button>
                                                                        </td>
                                                                        <td className="pl-4 py-2 whitespace-nowrap">
                                                                            <button className="bg-rose-500 py-3 px-4 rounded-md text-white" onClick={() => getRemove(ad)}>Remove</button>
                                                                        </td>
                                                                    </tr>
                                                                </Fragment>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
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
                                        <p id="nameError" className="mb-2 text-rose-500 hidden">Name field is required!</p>
                                        <h3 className="text-[#505562]">Email</h3>
                                        <input className="w-full p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" type="email" placeholder="Email" name="email" value={email} onChange={ev => setEmail(ev.target.value)}></input>
                                        <p id="emailError" className="mb-2 text-rose-500 hidden">Email field is required!</p>
                                        <div>
                                            <h3 className="text-[#505562]">Address</h3>
                                            <div className="flex items-center gap-2">
                                                <input className="w-full p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" type="text" placeholder="Address" name="address" value={address} onChange={ev => setAddress(ev.target.value)}></input>
                                                <select className="w-[35%] h-11 p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" value={address} onChange={ev => setAddress(ev.target.value)}>
                                                    {listAddress.map((ad,index) => (
                                                        <option key={index} value={ad}>{ad}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <p id="addressError" className="mb-2 text-rose-500 hidden">Address field is required!</p>
                                        </div>
                                        <h3 className="text-[#505562]">Phone number</h3>
                                        <input className="w-full p-2 mb-2 border-2 border-gray-400 rounded-sm box-border" type="text" placeholder="Phone Number" name="phoneNumber" value={phoneNumber} onChange={ev => setPhoneNumber(ev.target.value)}></input>
                                        <p id="phoneError" className="mb-2 text-rose-500 hidden">Phone field is required!</p>
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