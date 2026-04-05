import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { 
    getUserCart, 
    addItemToCart, 
    removeItemFromCart, 
    clearCart,
    deleteCart 
} from "../controllers/cart.controller.js"

const router = express.Router()

// GET the user's cart (Read)
router.get("/", protectRoute, getUserCart)

// POST to add a new item or update an existing item's quantity (Create/Update)
router.post("/add", protectRoute, addItemToCart)

// DELETE a specific item from the cart (Update)
// Uses a parameter to specify the product ID to remove
router.delete("/remove/:productId", protectRoute, removeItemFromCart)

// PUT/DELETE to clear all items from the cart (Update)
router.put("/clear", protectRoute, clearCart) // Using PUT to modify the resource
// Alternatively, you could use a dedicated DELETE route for the cart resource itself
// router.delete("/", protectRoute, deleteCart); 

// DELETE the entire cart document (Useful after checkout)
router.delete("/", protectRoute, deleteCart) 


export default router