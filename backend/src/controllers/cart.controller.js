import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

async function calculateCartSubTotal(items) {
  let subTotal = 0;
  for (const item of items) {
    const product = await Product.findById(item.product).select("price");
    if (product) {
      subTotal += product.price * item.quantity;
    }
  }
  return subTotal;
}

export async function getUserCart(req, res) {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          user: userId,
          items: [],
          subTotal: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error in getUserCart:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function addItemToCart(req, res) {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "Invalid product ID or quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    } else {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    }

    cart.subTotal = await calculateCartSubTotal(cart.items);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.status(200).json({
      success: true,
      cart: updatedCart,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error("Error in addItemToCart:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function removeItemFromCart(req, res) {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.subTotal = await calculateCartSubTotal(cart.items);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.status(200).json({
      success: true,
      cart: updatedCart,
      message: "Item removed successfully",
    });
  } catch (error) {
    console.error("Error in removeItemFromCart:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function clearCart(req, res) {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(200)
        .json({ success: true, message: "Cart is already empty" });
    }

    cart.items = [];
    cart.subTotal = 0;
    await cart.save();

    res.status(200).json({ success: true, cart, message: "Cart cleared" });
  } catch (error) {
    console.error("Error in clearCart:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteCart(req, res) {
  try {
    const userId = req.user._id;
    const result = await Cart.deleteOne({ user: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCart:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
