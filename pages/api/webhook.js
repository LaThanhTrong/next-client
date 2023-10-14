import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { buffer } from "micro";
import { Product } from "@/models/Product";
import { Inventory } from "@/models/Inventory";
import { OrderDetail } from "@/models/OrderDetail";
const stripe = require('stripe')(process.env.STRIPE_SK);

const endpointSecret = process.env.STRIPE_SIGN_SECRET;

export default async function handler(req,res){
    await mongooseConnect()
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const data = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            const orderId = data.metadata.orderId
            const paid = data.payment_status === 'paid'
            if(orderId && paid){
                await Order.findByIdAndUpdate(orderId, {
                    paid: true,
                    discount_amount: data.total_details.amount_discount,
                })
            }
            const li = await OrderDetail.findOne({order: orderId})
            let pid = []
            for(let i = 0; i < li.line_items.length; i++){
                pid.push({
                    _id: li.line_items[i].price_data.product_data.description.toString(),
                    quantity: li.line_items[i].quantity,
                })
            }
            for(let i = 0; i < pid.length; i++){
                await Inventory.updateOne({_id:pid[i]}, {
                    $inc: {quantity: -pid[i].quantity}
                })
            }
            break;
            // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send('ok')
}

export const config = {
    api: {
        bodyParser: false
    }
}

//key: dawn-elite-trusty-bonny
//id: acct_1NP1ehGiTUSNxfQg