import express from "express"
import { deleteUser, getUserProfile, getUsers, updateUserProfile } from "../controllers/user.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get('/profile', protectRoute, getUserProfile)
router.put('/profile', protectRoute, updateUserProfile)
router.get('/', getUsers)
router.delete('/:id', protectRoute, deleteUser)

export default router