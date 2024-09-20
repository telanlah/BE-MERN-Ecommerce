import express from "express"
import { adminMiddleware, protectedMiddleware } from "../middlewares/authMiddleware.js";
import { allOrder, createOrder, currentUserOrder, detailOrder } from "../controllers/orderController.js";

const router = express.Router()

// CRUD order

// create data order
// post /api/v1/order
//middleware user
router.post("/", protectedMiddleware, createOrder)

// semua data order
// get /api/v1/order
//middleware user
router.get("/", protectedMiddleware, adminMiddleware, allOrder)

// detail data order
// get /api/v1/order
//middleware user
router.get("/:id", protectedMiddleware, adminMiddleware, detailOrder)

// pengguna  order
// get /api/v1/order
//middleware user
router.get("/current/user", protectedMiddleware, currentUserOrder)



export default router 