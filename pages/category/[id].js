import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { Inventory } from "@/models/Inventory";
import ProductBox from "@/components/ProductBox";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export default function CategoryPage({_id, category, subCategories, inventory:originalInventory, categories, wishedProducts=[]}){
    const [wished, setWished] = useState(wishedProducts)
    const propertiesToFill = []
    if(categories.length > 0 && category._id){
        let catInfo = categories.find(({_id}) => _id === category._id);
        propertiesToFill.push(...catInfo.properties);
        while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id)
            propertiesToFill.push(...parentCat.properties)
            catInfo = parentCat
        }
    }

    const defaultFilterValues = propertiesToFill.map(p => ({name: p.name, value: 'all'}))
    const defaultSorting = '_id-desc'
    const [filtersValues, setFiltersValues] = useState(defaultFilterValues);
    const [inventory, setInventory] = useState(originalInventory);
    const [sort, setSort] = useState(defaultSorting)
    const [loadingInventory, setLoadingInventory] = useState(false)
    const [loadingWishes, setLoadingWishes] = useState(false)
    const [filtersChanged, setFiltersChanged] = useState(false)

    function handleFilterChange(filterName, filterValue){
        setFiltersValues(prev => {
            return prev.map(p => ({
                name: p.name,
                value: p.name === filterName ? filterValue : p.value,
            }))
        });
        setFiltersChanged(true)
    }

    useEffect(() => {
        if(!filtersChanged){
            return
        }
        setLoadingInventory(true)
        setLoadingWishes(true)
        axios.get('/api/wishlist').then(response => {
            setWished(response.data.map(wp => wp.inventory._id))
            setLoadingWishes(false)
        })
        const catIds = [category._id, ...(subCategories?.map(c => c._id) || [])];
        const params = new URLSearchParams;
        params.set('categories', catIds.join(','));
        params.set('sort', sort)
        filtersValues.forEach(f => {
            if (f.value !== 'all') {
              params.set(f.name, f.value);
            }
        })
        const url = `/api/inventory?` + params.toString();
        axios.get(url).then(res => {
            setInventory(res.data)
            setLoadingInventory(false)
        })
    },[filtersValues, sort, filtersChanged])

    return(
        <>
            <Center>
                <h1 className="font-bold text-[2rem] mt-8 mb-5">{category.name}</h1>
                <div className="grid grid-cols-5 items-center gap-4">
                    {propertiesToFill.length > 0 && propertiesToFill.map(prop => (
                        <div key={prop.name} className="border-[#ddd] border-2 py-[8px] px-[10px] rounded-md gap-2 grid grid-cols-2 text-[#444]">
                            <span>{prop.name}:</span>
                            <select className="bg-transparent border-0 outline-none" onChange={ev => handleFilterChange(prop.name, ev.target.value)} value={filtersValues.find(p => p.name === prop.name).value}>
                                <option value="all">All</option>
                                {prop.values.map(val => (
                                    <option key={val} value={val}>{val}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                    <div className="border-[#ddd] border-2 py-[8px] px-[10px] rounded-md gap-2 grid grid-cols-2 text-[#444]">
                        <span>Sort:</span>
                        <select className="bg-transparent border-0 outline-none" value={sort} onChange={ev => {setSort(ev.target.value); setFiltersChanged(true)}}>
                            <option value="price-asc">price, lowest first</option>
                            <option value="price-desc">price, highest first</option>
                            <option value="_id-desc">newest first</option>
                            <option value="_id-asc">oldest first</option>
                        </select>
                    </div>
                </div>
                {loadingInventory && (
                    <Spinner fullWidth />
                )}
                {!loadingInventory && !loadingWishes && (
                    <div className="mt-3 mb-8">
                        {inventory.length > 0 && (
                            <div className="grid grid-cols-4 gap-10 pt-[30px]">{inventory?.length > 0 && inventory.map(i => (
                                <div key={i._id} className="border-2 border-[#edeaea] rounded-md">
                                    <ProductBox key={i.product._id} {...i.product} inventoryId={i._id} quantity={i.quantity} price={i.price} wished={wished.includes(i._id)} categ={categories}></ProductBox>
                                </div>
                                ))}
                            </div>
                        )}
                        {inventory.length === 0 && (
                            <div>Sorry, no products found</div>
                        )}
                    </div>
                )}
            </Center>
        </>
    )
}

export async function getServerSideProps(context){
    await mongooseConnect()
    const {id} = context.query
    const category = await Category.findById(id)
    const categories = await Category.find().populate('parent')
    const subCategories = await Category.find({parent: category._id})
    const catIds = [category._id, ...subCategories.map(c => c._id)]
    const products = await Product.find({category: catIds})
    const productIds = products.map(product => product._id);
    const inventory = await Inventory.find({ product: { $in: productIds } }).populate('product')
    const session = await getServerSession(context.req, context.res, authOptions)
    const wishedProducts = session?.user ? await WishedProduct.find({
        userEmail: session.user.email,
        inventory: inventory.map(i => i._id.toString()),
      }) : []
    return {
        props:{
            _id: JSON.parse(JSON.stringify(id)),
            category: JSON.parse(JSON.stringify(category)),
            subCategories: JSON.parse(JSON.stringify(subCategories)),
            inventory: JSON.parse(JSON.stringify(inventory)),
            categories : JSON.parse(JSON.stringify(categories)),
            wishedProducts: wishedProducts.map(i => i.inventory.toString()),
        }
    }
}