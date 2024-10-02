import express from "express"
import { adminMiddleware, protectedMiddleware } from "../middlewares/authMiddleware.js";
import { allProduct, createProduct, deleteProduct, detailProduct, fileUpload, updateProduct } from "../controllers/productController.js";
import { upload } from '../utils/uploadFileHandler.js'

const router = express.Router()

// CRUD Product

// create data product
// post /api/v1/product
//middleware owner
router.post("/", protectedMiddleware, adminMiddleware, createProduct)

// read all data product
// get /api/v1/product/
router.get("/", allProduct)

// read data product 
// post /api/v1/product/:id
router.get("/:id", detailProduct)

// update data product
// put /api/v1/product/:id
//middleware owner
router.put("/:id", protectedMiddleware, adminMiddleware, updateProduct)

// update data product
// delete /api/v1/product/:id
//middleware owner
router.delete("/:id", protectedMiddleware, adminMiddleware, deleteProduct)

// file upload data product
// post /api/v1/product/file-upload
//middleware owner
router.post("/file", protectedMiddleware, adminMiddleware, upload.single('image'), fileUpload)



export default router 