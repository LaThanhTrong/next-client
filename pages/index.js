import Featured from "@/components/Featured";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Setting } from "@/models/Setting";
import Steps from "@/components/Steps";
import AboutUs from "@/components/AboutUs";
import { Category } from "@/models/Category";

export default function Home({featuredProduct, newProducts, wishedNewProducts, categ}){ 
  return (
    <div>
      <Featured product={featuredProduct}></Featured>
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} categ={categ}></NewProducts>
      <Steps></Steps>
      <AboutUs></AboutUs>
    </div>
  )
}

export async function getServerSideProps(ctx){
  await mongooseConnect()
  const featuredProductSetting = await Setting.findOne({name: 'featuredProductId'})
  const featuredProductId = featuredProductSetting.value
  const featuredProduct = await Product.findById(featuredProductId)
  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:8});
  const categ = await Category.find().populate('parent')
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  const wishedNewProducts = session?.user ? await WishedProduct.find({
    userEmail: session.user.email,
    product: newProducts.map(p => p._id.toString()),
  }) : []
  return{
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedNewProducts: wishedNewProducts.map(i => i.product.toString()),
      categ: JSON.parse(JSON.stringify(categ)),
    }
  }
}