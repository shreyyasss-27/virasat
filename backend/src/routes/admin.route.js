import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getAdminStats,
  getAllUsers,
  getAllProducts,
  getAllOrders,
  updateUserStatus,
  updateUser,
  updateProductStatus,
  updateProduct,
  updateOrder,
  deleteUser,
  deleteProduct,
  deleteOrder
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin stats endpoint - require ADMIN role
router.get("/stats", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  getAdminStats(req, res);
});

// User management endpoints - require ADMIN role
router.get("/users", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  getAllUsers(req, res);
});

router.put("/users/:userId/status", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  updateUserStatus(req, res);
});

router.put("/users/:userId", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  updateUser(req, res);
});

router.delete("/users/:userId", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  deleteUser(req, res);
});

// Product management endpoints - require ADMIN role
router.get("/products", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  getAllProducts(req, res);
});

router.put("/products/:productId/status", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  updateProductStatus(req, res);
});

router.put("/products/:productId", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  updateProduct(req, res);
});

router.delete("/products/:productId", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  deleteProduct(req, res);
});

// Order management endpoints - require ADMIN role
router.get("/orders", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  getAllOrders(req, res);
});

router.put("/orders/:orderId", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  updateOrder(req, res);
});

router.delete("/orders/:orderId", protectRoute, (req, res, next) => {
  if (!req.user.roles.includes("ADMIN")) {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  deleteOrder(req, res);
});

export default router;
