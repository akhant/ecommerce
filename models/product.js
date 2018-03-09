import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    name: String,
    price: Number,
    image: String
})

export default mongoose.model('Product', ProductSchema)