import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";



export const createOrder = asyncHandler(async (req, res) => {
    const { email, firstName, lastName, phone, cartItem } = req.body

    if (!cartItem || cartItem.length < 1) {
        res.status(400)
        throw new Error('Keranjang masih kosong')
    }

    let orderItem = []
    let total = 0

    for (const cart of cartItem) {
        const productData = await Product.findOne({ _id: cart.product })
        if (!productData) {
            res.status(400)
            throw new Error('Product tidak ditemukan')
        }

        const { name, price, _id } = productData
        const singleProduct = {
            quantity: cart.quantity,
            name,
            price,
            product: _id
        }


        orderItem = [...orderItem, productData]

        total += cart.quantity * price
    }

    const order = await Order.create({
        itemDetail: orderItem,
        total,
        firstName,
        lastName,
        email,
        phone,
        user: req.user.id
    })

    return res.status(200).json({
        message: "berhasil buat order product",
        order,
    })
})
export const allOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find()

    return res.status(200).json({
        message: "Menampilkan semua order product",
        data: orders,
    })
})
export const detailOrder = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id)

    return res.status(200).json({
        message: "Menampilkan order product",
        data: order,
    })
})
export const currentUserOrder = asyncHandler(async (req, res) => {

    const order = await Order.find({ 'user': req.user.id })
    
    return res.status(200).json({
        message: "Berhasil menampilkan user current produk",
        data: order,
    })
})