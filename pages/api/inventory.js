import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Inventory } from "@/models/Inventory";

export default async function handle(req, res) {
    await mongooseConnect();
    const {categories, sort, phrase, ...filters} = req.query;
    let [sortField, sortOrder] = (sort || '_id-desc').split('-');
    const productsQuery = {};
    if (categories) {
      productsQuery.category = categories.split(',');
    }
    if (phrase) {
      productsQuery['$or'] = [
        {title:{$regex:phrase,$options:'i'}},
        {description:{$regex:phrase,$options:'i'}},
      ];
    }
    if (Object.keys(filters).length > 0) {
        Object.keys(filters).forEach(filterName => {
            productsQuery['properties.'+filterName] = filters[filterName];
      });
    }
    
    const products = await Product.find(productsQuery, null, {sort:{[sortField]: sortOrder === 'asc' ? 1 : -1}})
    const productIds = products.map(product => product._id);
    res.json(await Inventory.find({ product: { $in: productIds } }).populate('product'));
}