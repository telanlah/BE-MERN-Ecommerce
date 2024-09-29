import mongoose from 'mongoose';


const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nama Product Harus diisi'],
    unique: [true, 'Nama Product sudah digunakan silahkan diganti'],
  },
  price: {
    type: Number,
    required: [true, 'Harga Harus diisi'],
  },
  description: {
    type: String,
    required: [true, 'Deskripsi Product Harus diisi'],
  },
  image: {
    type: String,
    default: null,
  },
  category:{
    type: String,
    required: [true, 'Kategory Product Harus diisi'],
    enum: ["sepatu","kemeja","baju","celana"]
  },
  stock:{
    type: Number,
    default:0
  }
});



const Product = mongoose.model("Product", productSchema)

export default Product