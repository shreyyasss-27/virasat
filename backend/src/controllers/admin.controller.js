import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export async function getAdminStats(req, res) {
  try {
    console.log("getAdminStats called, user:", req.user);
    
    // Set proper content type
    res.setHeader('Content-Type', 'application/json');
    
    // Debug: Test database connection
    console.log("Testing database connection...");
    
    // Get counts from database
    console.log("Getting user count...");
    const totalUsers = await User.countDocuments();
    console.log("User count:", totalUsers);
    
    console.log("Getting product count...");
    const totalProducts = await Product.countDocuments();
    console.log("Product count:", totalProducts);
    
    console.log("Getting order count...");
    const totalOrders = await Order.countDocuments();
    console.log("Order count:", totalOrders);
    
    // Calculate total revenue (sum of all order totals)
    console.log("Getting orders for revenue calculation...");
    const orders = await Order.find({});
    console.log("Orders found:", orders.length);
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    console.log("Total revenue calculated:", totalRevenue);

    console.log("Admin stats fetched:", { totalUsers, totalProducts, totalOrders, totalRevenue });

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    console.error("Error in getAdminStats:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    console.log("Updating user:", userId, "with updates:", updates);
    console.log("All req.params:", req.params);
    
    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      console.log("User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User updated successfully:", updatedUser._id);

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Failed to update user" });
  }
}

export async function getAllUsers(req, res) {
  try {
    // Set proper content type
    res.setHeader('Content-Type', 'application/json');
    
    const { page = 1, limit = 10, search = "" } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .select("-password");

    const total = await User.countDocuments(query);

    console.log("Users fetched:", { page, limit, total: users.length });

    res.status(200).json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

export async function getAllProducts(req, res) {
  try {
    const { page = 1, limit = 12, search = "" } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('seller', 'firstName lastName email');

    const total = await Product.countDocuments(query);

    res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

export async function updateProduct(req, res) {
  try {
    const { productId } = req.params;
    const updates = req.body;
    
    console.log("Updating product:", productId, "with updates:", updates);
    
    // Find and update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      console.log("Product not found:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product updated successfully:", updatedProduct._id);

    res.status(200).json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Failed to update product" });
  }
}

export async function updateOrder(req, res) {
  try {
    const { orderId } = req.params;
    const updates = req.body;
    
    console.log("Updating order:", orderId, "with updates:", updates);
    
    // Find and update order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      console.log("Order not found:", orderId);
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Order updated successfully:", updatedOrder._id);

    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ message: "Failed to update order" });
  }
}

export async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;
    
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Order deleted:", orderId);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Failed to delete order" });
  }
}

export async function getAllOrders(req, res) {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { "items.name": { $regex: search, $options: "i" } },
        { "shippingAddress.street": { $regex: search, $options: "i" } }
      ];
    }

    const orders = await Order.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

export async function updateUserStatus(req, res) {
  try {
    const { userId, status } = req.body;
    
    if (!userId || !status) {
      return res.status(400).json({ message: "User ID and status are required" });
    }

    const validStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      user
    });
  } catch (error) {
    console.error("Error in updateUserStatus:", error.message);
    res.status(500).json({ message: "Failed to update user status" });
  }
}

export async function updateProductStatus(req, res) {
  try {
    const { productId } = req.params;
    const { status } = req.body;
    
    console.log("updateProductStatus called with:", {
      params: req.params,
      body: req.body,
      productId,
      status
    });
    
    if (!productId || !status) {
      console.log("Missing productId or status:", { productId, status });
      return res.status(400).json({ message: "Product ID and status are required" });
    }

    const validStatuses = ["ACTIVE", "INACTIVE", "SOLD"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product status updated:", productId, "to", status);

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error in updateProductStatus:", error.message);
    res.status(500).json({ message: "Failed to update product status" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteUser:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error.message);
    res.status(500).json({ message: "Failed to delete product" });
  }
}
