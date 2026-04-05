import Product from "../models/product.model.js";
import {cleanupMedia} from "../controllers/media.controller.js"

export async function getProducts(req, res) {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    // Search by keyword (name or category)
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { category: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    // Optional category filter
    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const filter = { ...keyword, ...categoryFilter };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("seller", "firstName lastName email") // optional
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    console.error("Error in getProducts:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProductsBySeller(req, res){
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });

    if (!products) {
      return res.status(404).json({ message: "No Products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getProductById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "firstName lastName email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      category,
      price,
      stock,
      tags,
      image,
    } = req.body;

    // Basic validation
    if (!name || !description || !category || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log(image)

    const product = new Product({
      name,
      description,
      category,
      price,
      stock: stock || 1,
      tags: tags || [],
      image: {mediaId: image.mediaId, url: image.url},
      seller: req.user._id, // must come from auth middleware
    });

    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    console.error("Error in createProduct:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Authorization
    if (product.seller.toString() !== req.user._id.toString() && !req.user.roles.includes("ADMIN")) {
      return res.status(403).json({ message: "Not authorized to edit this product" });
    }

    // --- NEW IMAGE REPLACEMENT LOGIC ---
    if (req.body.image && req.body.image.mediaId) {
      const newMediaId = req.body.image.mediaId;
      const oldMediaId = product.image?.mediaId;

      // Only trigger cleanup if a new/different image is being provided
      if (oldMediaId && oldMediaId.toString() !== newMediaId.toString()) {
        console.log("Replacing image. Cleaning up old media:", oldMediaId);
        // Using the helper function we created earlier
        await cleanupMedia(oldMediaId);
      }
    }

    // Update fields
    const allowedFields = ["name", "description", "category", "price", "stock", "tags", "image", "isActive", "isApproved"];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Special handling for the image object to ensure structure is maintained
        if (field === "image") {
          product.image = {
            mediaId: req.body.image.mediaId,
            url: req.body.image.url,
            altText: req.body.image.altText || req.body.name || product.name
          };
        } else {
          product[field] = req.body[field];
        }
      }
    });

    const updatedProduct = await product.save();
    
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error in updateProduct:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 1. Authorization Check
    const isOwner = product.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.roles.includes("ADMIN");

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    console.log("1")
    console.log(product)

    // 2. Reuse the cleanup logic
    if (product.image && product.image.mediaId) {
      await cleanupMedia(product.image.mediaId);
      console.log(`Media ${product.image.mediaId} cleaned up.`);
    console.log("2")

    }


    // 3. Delete the Product
    await Product.deleteOne({ _id: product._id });


    res.status(200).json({ 
      success: true, 
      message: "Product and its media deleted successfully" 
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createProductReview(req, res) {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id).populate("reviews");

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user already reviewed (if Review schema stores user references)
    const existingReview = product.reviews.find(
      (r) => r.user?.toString() === req.user._id.toString()
    );
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Create a new review document (assuming Review model exists)
    const Review = (await import("../models/review.model.js")).default;
    const review = await Review.create({
      user: req.user._id,
      rating: Number(rating),
      comment,
      product: product._id,
    });

    // Push the review reference
    product.reviews.push(review._id);
    product.totalRatings += 1;
    product.averageRating =
      ((product.averageRating * (product.totalRatings - 1)) + Number(rating)) /
      product.totalRatings;

    await product.save();

    res.status(201).json({ success: true, message: "Review added successfully" });
  } catch (error) {
    console.error("Error in createProductReview:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
