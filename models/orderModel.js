import mongoose from "mongoose";
const { Schema } = mongoose;

const singleProduct = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    product: { type: mongoose.Schema.ObjectId, required: true, ref: "Product" },
})

const orderSchema = new Schema({
    total: {
        type: Number,
        required: [true, 'total harga harus diisi']
    },
    itemDetail: [],
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ['pending', "failed", "success"]
    },
    firstName: {
        type: String,
        required: [true, 'nama depan harus diisi']
    },
    lastName: {
        type: String,
        required: [true, 'nama belakang harus diisi']
    },
    phone: {
        type: String,
        required: [true, 'nomor telefon harus diisi']
    },
    phone: {
        type: String,
        required: [true, 'email harus diisi']

    },
});

const Order = mongoose.model("Order", orderSchema);

export default Order