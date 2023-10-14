import { mongooseConnect } from "@/lib/mongoose"
import { Order } from "@/models/Order"
import { Product } from "@/models/Product";
import { Inventory } from "@/models/Inventory";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Setting } from "@/models/Setting";
import { OrderDetail } from "@/models/OrderDetail";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res){
    if(req.method !== 'POST'){
        res.json('should be a POST request')
        return
    }
    await mongooseConnect()
    const {name, email, address, phoneNumber, cartProducts} = req.body
    const inventoryIds = cartProducts
    const uniqueIds = [...new Set(inventoryIds)]
    const productsInfos = await Inventory.find({_id:uniqueIds}).populate('product')

    let line_items = [];
    for (const inventoryId of uniqueIds) {
        const productInfo = productsInfos.find(p => p._id.toString() === inventoryId);
        const quantity = inventoryIds.filter(id => id === inventoryId)?.length || 0;
        if (quantity > 0 && productInfo) {
            line_items.push({
                quantity,
                price_data: {
                    currency: 'VND',
                    product_data: {
                        name: productInfo.product.title,
                        description: productInfo._id,
                    },
                    unit_amount: productInfo.price,
                },
            });
        }
    }

    const session = await getServerSession(req,res,authOptions)

    const shippingFeeSetting = await Setting.findOne({name: 'shippingFee'})
    const shippingFeeCents = parseInt(shippingFeeSetting.value || '0')

    const orderDoc = await Order.create({
        name,email, address, phoneNumber, paid:false, userEmail: session?.user?.email, shippingFee: shippingFeeCents, discount_amount: 0,
    })

    const orderDetailDoc = await OrderDetail.create({
        order: orderDoc._id,
        line_items,
    })

    const stripeSession = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: email,
        success_url: process.env.PUBLIC_URL + '/cart?success=1',
        cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
        metadata: {orderId:orderDoc._id.toString()},
        allow_promotion_codes: true,
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: 'Shipping fee',
                    type: 'fixed_amount',
                    fixed_amount: {amount: shippingFeeCents, currency: 'VND'},
                }
            }
        ] 
    })

    res.json({
        url: stripeSession.url,
    })
}