import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    name: { type: String, unique: true, lowercase: true }
})

export default mongoose.model('Category', CategorySchema)