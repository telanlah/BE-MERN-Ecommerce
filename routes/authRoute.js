import express from "express"
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../controllers/authController.js";
import { protectedMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router()


//post /api/v1/auth/register
router.post('/register', registerUser)

//post /api/v1/auth/login
router.post('/login', loginUser)
//get /api/v1/auth/logout
router.get('/logout', protectedMiddleware, logoutUser)
//get /api/v1/auth/getUser
router.get('/getuser', protectedMiddleware, getCurrentUser)

export default router 