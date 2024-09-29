import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';



export const createProduct = asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body)

    return res.status(200).json({
        message: "berhasil tambah product",
        data: newProduct,
    })
})
export const allProduct = asyncHandler(async (req, res) => {
    // req query
    const queryObj = { ...req.query }

    //fungsi untuk mengabaikan page dan limit
    const excludeField = ["page", "limit", "name"]
    excludeField.forEach((element) => delete queryObj[element])

    let query

    if (req.query.name) {
        query = Product.find({
            name: { $regex: req.query.name, $options: 'i' }
        })
    } else {

        // fungsi untuk mencari berdasarkan category
        query = Product.find(queryObj)
    }
    // fungsi pagination
    const page = req.query.page * 1 || 1
    const limitData = req.query.limit * 1 || 10
    const skipData = (page - 1) * limitData

    query = query.skip(skipData).limit(limitData)

    let countProduct = await Product.countDocuments(queryObj)

    if (req.query.page) {

        if (skipData >= countProduct) {
            res.status(400)
            throw new Error('this page doesnt exist')
        }
    }

    const data = await query
    const totalPage = Math.ceil(countProduct / limitData)

    return res.status(200).json({
        message: "Berhasil menampilkan semua product",
        data,
        pagination: {
            totalPage,
            page,
            totalProduct: countProduct
        }
    })
})
export const detailProduct = asyncHandler(async (req, res) => {
    const paramsId = req.params.id
    const productData = await Product.findById(paramsId)

    if (!productData) {
        res.status(404)
        throw new Error("ID product Tidak ditemukan ")
    }
    return res.status(201).json({
        message: "Detail data Product berhasil ditampilkan",
        data: productData,
    })
})
export const updateProduct = asyncHandler(async (req, res) => {
    const paramsId = req.params.id
    const productData = await Product.findByIdAndUpdate(paramsId, req.body, {
        runValidators: false,
        new: true,
    })

    if (!productData) {
        res.status(404)
        throw new Error("ID product Tidak ditemukan ")
    }
    return res.status(201).json({
        message: "Data Product berhasil diubah",
        data: productData,
    })
})
export const deleteProduct = asyncHandler(async (req, res) => {
    const paramsId = req.params.id
    const productData = await Product.findByIdAndDelete(paramsId)

    if (productData) {
        return res.status(200).json({
            message: "Data berhasil dihapus"
        })
    }
})
export const fileUpload = asyncHandler(async (req, res) => {
    const stream = cloudinary.uploader.upload_stream({
        folder: "uploads",
        allowed_formats: ["jpg", "png"]
    },
        function (err, result) {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: "gagal upload gambar",
                    error: err
                }
                )
            }
            res.json({
                message: "gambar berhasil di upload",
                url: result.secure_url
            })
        }
    )

    streamifier.createReadStream(req.file.buffer).pipe(stream)

})