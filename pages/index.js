import { mongooseConnect } from "@/lib/mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"
import { Setting } from "@/models/Setting"
import { Inventory } from "@/models/Inventory"
import { Category } from "@/models/Category"
import { WishedProduct } from "@/models/WishedProduct"
import { Product } from "@/models/Product"
import Featured from "@/components/Featured"
import NewProducts from "@/components/NewProducts"
import Steps from "@/components/Steps"
import AboutUs from "@/components/AboutUs"
import CleverChatBot from "@/components/Chatbot"

export default function Home({featuredProduct, newProducts, wishedNewProducts, categ}){ 
  return (
    <div>
      {featuredProduct && <Featured inventory={featuredProduct} product={featuredProduct.product}></Featured>}
      {newProducts && <NewProducts products={newProducts} wishedProducts={wishedNewProducts} categ={categ}></NewProducts>}
      <Steps></Steps>
      <AboutUs></AboutUs>
      <CleverChatBot></CleverChatBot>
    </div>
  )
}

export async function getServerSideProps(ctx){
  await mongooseConnect()
  const featuredProductSetting = await Setting.findOne({name: 'featuredProductId'})
  const featuredProductId = featuredProductSetting.value
  const featuredProduct = await Inventory.findOne({product: featuredProductId}).populate('product')
  const newProducts = await Inventory.find({}, null, {sort: {'_id':-1}, limit:8}).populate('product');
  const categ = await Category.find().populate('parent')
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  const wishedNewProducts = session?.user ? await WishedProduct.find({
    userEmail: session.user.email,
    inventory: newProducts.map(i => i._id.toString()),
  }) : []
  return{
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedNewProducts: wishedNewProducts.map(i => i.inventory.toString()),
      categ: JSON.parse(JSON.stringify(categ)),
    }
  }
}