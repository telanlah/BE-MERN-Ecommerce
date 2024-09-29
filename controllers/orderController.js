import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import midtransClient from 'midtrans-client'
import dotenv from 'dotenv'

dotenv.config()

let snap = new midtransClient.Snap({
    // set true when its productio
    isProduction: false,
    serverKey: process.env.midtrans_serverKey,
})


export const createOrder = asyncHandler(async (req, res) => {
    const { email, firstName, lastName, phone, cartItem } = req.body

    if (!cartItem || cartItem.length < 1) {
        res.status(400)
        throw new Error('Keranjang masih kosong')
    }

    let orderItem = []
    let orderMidtrans = []
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

        const shortName = name.substring(0, 30)
        const singleProductMidtrans = {
            quantity: cart.quantity,
            name: shortName,
            price,
            id: _id
        }


        orderItem = [...orderItem, singleProduct]
        orderMidtrans = [...orderMidtrans, singleProductMidtrans]

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
    let parameter = {
        "transaction_details": {
            "order_id": order._id,
            "gross_amount": total
        },
        "item_details": orderMidtrans,
        "customer_details": {
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phone,

        }
    }

    const token = await snap.createTransaction(parameter)



    return res.status(200).json({
        message: "berhasil buat order product",
        order,
        token,
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

export const callbackPayment = asyncHandler(async (req, res) => {
    const statusResponse = snap.transaction.notification(req.body)

    let orderId = statusResponse.order_id;
    let transactionStatus = statusResponse.transaction_status;
    let fraudStatus = statusResponse.fraud_status;

    const orderData = await Order.findById(orderId)

    if (!orderData) {
        res.status(404)
        throw new Error("Orderan tidak ditemukan")
    }



    console.log(`Transaction notification received. Order  ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    // Sample transactionStatus handling logic

    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
        if (fraudStatus == 'accept') {
            const orderProduct = orderData.itemDetail
            for (const itemProduct of orderProduct) {
                const productData = await Product.findById(itemProduct.product)
                if (!productData) {
                    res.status(404)
                    throw new Error("Produk tidak ditemukan")
                }

                productData.stock = productData.stock - itemProduct.quantity
                await productData.save()
            }

            orderData.status = "success"
        }

    } else if (transactionStatus == 'cancel' ||
        transactionStatus == 'deny' ||
        transactionStatus == 'expire') {
        // TODO set transaction status on your database to 'failure'
        // and response with 200 OK
        orderData.status = "failed"
    } else if (transactionStatus == 'pending') {
        // TODO set transaction status on your database to 'pending' / waiting payment
        // and response with 200 OK
        orderData.status = "pending"
    }

    await orderData.save()
    return res.status(200).send("payment notif berhasil")

})