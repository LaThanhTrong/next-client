import Center from "@/components/Center";
import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { Inventory } from "@/models/Inventory";
import ProductBox from "@/components/ProductBox";
import Link from "next/link";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import { Product } from "@/models/Product";
import "react-multi-carousel/lib/styles.css";

export default function CategoriesPage({ mainCategories, categoriesProducts, wishedProducts = [], categ }) {
    const [selected, setSelected] = useState([])
    const [categoriesSelected, setCategoriesSelected] = useState(categ)
    const [expandedCategories, setExpandedCategories] = useState({});
    const toggleCategory = (id) => {
        setExpandedCategories((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    const [data, setData] = useState(() => {
        let item = {}
        for (let i = 0; i < mainCategories.length; i++) {
            item[mainCategories[i]._id] = []
            for (let j = 0; j < mainCategories.length; j++) {
                if (mainCategories[j].parent?.toString() === mainCategories[i]._id.toString()) {
                    item[mainCategories[i]._id].push(mainCategories[j])
                }
            }
        }
        return item
    })

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

    function handleChange(e) {
        if (e.target.checked) {
            setSelected([...selected, e.target.value])
        }
        else {
            setSelected(selected.filter(s => s !== e.target.value))
            document.querySelectorAll(`.render-${e.target.value}`).forEach(el => {
                el.checked = false
            })
        }
    }

    useEffect(() => {
        if (selected.length > 0) {
            setCategoriesSelected(categ.filter(c => selected.find(s => s === c.name)))
        }
        else {
            setCategoriesSelected(categ)
        }
    }, [selected])

    const renderCategories = (categories, level = 0) => {
        return (
            <div style={{ marginLeft: `${level * 20}px` }}>
                {categories.map((category, i) => {
                    const id = `${category.name}-${level}-${i}`; // Generate a unique id
                    return (
                        <div key={id} className="flex flex-col items-start my-2">
                            <div className="flex items-center">
                                <input
                                    className={"hidden render-" + category.name}
                                    id={`check-${id}`} // Use the unique id for each checkbox
                                    type="checkbox"
                                    value={category.name}
                                    onChange={ev => handleChange(ev)}
                                />
                                <label className="flex items-center" htmlFor={`check-${id}`}>
                                    <span className="w-5 h-5 mr-2 rounded border border-gray-400 flex items-center justify-center">
                                        <svg className="hidden w-3 h-3 text-blue-500 pointer-events-none" viewBox="0 0 173.867 173.867">
                                            <path d="M57.253,166.012L0,108.758l34.142-34.142l23.111,23.111l86.582-86.581l34.142,34.141L57.253,166.012z" />
                                        </svg>
                                    </span>
                                    {category.name}
                                </label>
                                {data[category._id] && data[category._id].length > 0 && (
                                    <>
                                        <button onClick={() => toggleCategory(id)} className="ml-2 text-blue-500 underline">
                                            {expandedCategories[id] ? 'Collapse' : 'Expand'}
                                        </button>
                                    </>
                                )}
                            </div>
                            {expandedCategories[id] && renderCategories(data[category._id], level + 1)}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <Center>
                <div className="pb-8">
                    <div className="px-6 py-7 bg-gray-100 rounded-b-md flex items-start">
                        <div id="menu" className="max-w-fit">
                            <button id="burger-button">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                            <div id="categories">
                                {renderCategories(mainCategories)}
                            </div>
                        </div>
                        <h2 className="font-bold text-[1.5rem] mb-4 text-center">Filter categories</h2>
                    </div>
                </div>

                {categoriesSelected.map(category => (
                    <div key={category._id} className="mb-10">
                        <div className="mt-8 pt-7 mb-3 font-bold text-[1.5rem]">
                            {category.name}
                            <span className="font-normal text-[1.1rem] ml-4">
                                <Link className="underline text-[#555]" href={'/category/' + category._id}>Show all {category.name}</Link>
                            </span>
                        </div>
                        <div className="z-0">
                            <Carousel responsive={responsive}>
                                {categoriesProducts[category._id] && categoriesProducts[category._id].map((i, index) => (
                                    <div key={index} className="border-2 border-[#edeaea] rounded-md mr-7">
                                        <ProductBox key={i.product._id} {...i.product} inventoryId={i._id} quantity={i.quantity} price={i.price} wished={wishedProducts.includes(i._id)} categ={categ}></ProductBox>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                ))}
            </Center>
        </>
    )
}

async function findAllChildCategoryIds(categoryId) {
    await mongooseConnect()
    const childCategories = await Category.find({ parent: categoryId });
    const childCatIds = childCategories.map(childCat => childCat._id.toString());

    for (const childCatId of childCatIds) {
        const nestedChildCatIds = await findAllChildCategoryIds(childCatId);
        childCatIds.push(...nestedChildCatIds);
    }

    return childCatIds;
}

export async function getServerSideProps(ctx) {
    await mongooseConnect()
    const mainCategories = await Category.find().populate('parent')
    const categoriesProducts = {}
    const allFetchedProductsId = [];
    for (const mainCat of mainCategories) {
        const mainCatId = mainCat._id.toString()
        const childCatIds = await findAllChildCategoryIds(mainCat._id);
        const categoriesIds = [mainCatId, ...childCatIds]
        const products = await Product.find({ category: categoriesIds }, null, { sort: { '_id': -1 } })
        const productIds = products.map(product => product._id);
        const inventory = await Inventory.find({ product: { $in: productIds } }).populate('product')
        allFetchedProductsId.push(...inventory.map(i => i._id.toString()))
        categoriesProducts[mainCat._id] = inventory
    }
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    const wishedProducts = session?.user ? await WishedProduct.find({
        userEmail: session.user.email,
        inventory: allFetchedProductsId,
    }) : []
    return {
        props: {
            mainCategories: JSON.parse(JSON.stringify(mainCategories)),
            categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
            wishedProducts: wishedProducts.map(i => i.inventory.toString()),
            categ: JSON.parse(JSON.stringify(mainCategories)),
        }
    }
}