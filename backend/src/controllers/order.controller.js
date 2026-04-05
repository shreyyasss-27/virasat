import Order from "../models/order.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function addOrderItems(req, res) {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // Validate shipping address fields
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
      return res.status(400).json({ message: "Please provide complete shipping address (street, city, country)" });
    }

    console.log("Creating order with data:", {
      user: req.user._id,
      itemsCount: items.length,
      totalAmount,
      paymentMethod
    });

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    const createdOrder = await order.save();
    console.log("Order created successfully:", createdOrder._id);
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error in addOrderItems:", error.message);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        details: validationErrors 
      });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "firstName email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Allow only the order owner or admins
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error in getOrderById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateOrderToPaid(req, res) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error in updateOrderToPaid:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id });
    console.log(orders)
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getMyOrders:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await Order.find({}).populate("user", "firstName email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getOrders:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateOrderToDelivered(req, res) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = "DELIVERED";

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error in updateOrderToDelivered:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Create Razorpay order
export async function createRazorpayOrder(req, res) {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Error in createRazorpayOrder:", error.message);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
}

// Verify Razorpay payment and update order
export async function verifyRazorpayPayment(req, res) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    console.log("Payment verification request:", {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature?.substring(0, 20) + "..."
    });

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing required payment details" });
    }

    // Check if Razorpay secret is configured
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET not configured in environment");
      return res.status(500).json({ message: "Payment verification not configured" });
    }

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    console.log("Signature verification:", {
      generated: generatedSignature?.substring(0, 20) + "...",
      received: razorpaySignature?.substring(0, 20) + "...",
      match: generatedSignature === razorpaySignature
    });

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update order with payment details
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify order ownership
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    console.log("Updating order with payment details...");
    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = "PAID";
    order.paymentMethod = "RAZORPAY";
    order.razorpayOrderId = razorpayOrderId;
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.paymentResult = {
      id: razorpayPaymentId,
      status: "COMPLETED",
      update_time: new Date().toISOString(),
    };

    const updatedOrder = await order.save();
    console.log("Order updated successfully:", updatedOrder._id);

    res.status(200).json({
      success: true,
      order: updatedOrder,
      message: "Payment verified and order updated successfully",
    });
  } catch (error) {
    console.error("Error in verifyRazorpayPayment:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
}
