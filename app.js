import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRouter from './routes/authRoute.js'
import productRouter from './routes/productRoute.js'
import orderRouter from './routes/orderRoute.js'
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cookieParser from 'cookie-parser';
import helmet from 'helmet'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import { v2 as cloudinary } from 'cloudinary';

const app = express()
const port = 3000


dotenv.config()

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// APP Security middleware
app.use(helmet())
app.use(ExpressMongoSanitize())

//agar folder dapat diakses melalui browser
app.use(express.static('./public'))
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// entpoint
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/order', orderRouter)


app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Aplikasi jalan di port ${port}`)
})

mongoose.connect(process.env.DATABASE, {}).then(() => {
    console.log("Database Connect")
}).catch((err) => { })