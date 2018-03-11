import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CartSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User"},
    total: {type: Number, default: 0},
    items: [{
        item: {type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1}, 
        price: { type: Number, default: 0 }
    }]
})

export default mongoose.model('Cart', CartSchema)