import Center from "./Center";
import ProductBox from "./ProductBox";
import { RevealWrapper } from "next-reveal";

export default function NewProducts({products, wishedProducts=[], categ}){
    return(
        <Center>
            <div className="my-8 bg-[#f7f7f9] px-8 py-12 rounded-lg">
                <h2 className="font-bold text-3xl">Newly added items</h2>
                <div className="grid grid-cols-4 gap-10 pt-[30px]">
                    {products?.length > 0 && products.map((i,index) => (
                        <RevealWrapper key={i._id} delay={index*50}>
                            <ProductBox key={i.product._id} {...i.product} inventoryId={i._id} quantity={i.quantity} price={i.price} wished={wishedProducts.includes(i._id)} categ={categ}></ProductBox>
                        </RevealWrapper>
                    ))}
                </div>
            </div>
        </Center>
    )
}