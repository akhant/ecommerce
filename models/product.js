import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic'
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    name: String,
    price: Number,
    image: String
})

ProductSchema.plugin(mongoosastic, {
    hosts: [
        'localhost:9200'
    ]
})

export default mongoose.model('Product', ProductSchema)