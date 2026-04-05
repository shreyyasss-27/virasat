import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { createProduct, deleteProduct, getProductById, getProducts, getProductsBySeller, updateProduct } from "../controllers/product.controller.js"

const router = express.Router()

router.get("/", getProducts)
router.get("/seller", protectRoute, getProductsBySeller)
router.get("/:id", getProductById)
router.post("/", protectRoute, createProduct)
router.put("/:id", protectRoute, updateProduct)
router.delete("/:id", protectRoute, deleteProduct)

export default router
