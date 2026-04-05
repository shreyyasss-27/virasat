import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

export async function createOrUpdateReview(req, res) {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user already has a review for this product
    let review = await Review.findOne({ user: userId, product: productId });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      // Create new review
      review = await Review.create({
        user: userId,
        product: productId,
        rating,
        comment,
      });
    }

    // Recalculate average rating and total ratings
    const reviews = await Review.find({ product: productId });
    const totalRatings = reviews.length;
    const averageRating =
      totalRatings > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalRatings
        : 0;

    product.averageRating = averageRating;
    product.totalRatings = totalRatings;
    await product.save();

    res.status(200).json({
      success: true,
      message: review.isNew ? "Review created" : "Review updated",
      review,
      averageRating,
      totalRatings,
    });
  } catch (error) {
    console.error("Error in createOrUpdateReview:", error.message);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProductReviews(req, res) {
  try {
    const productId = req.params.productId;
    const reviews = await Review.find({ product: productId })
      .populate("user", "firstName lastName profilePic");

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error("Error in getProductReviews:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Only owner or admin can delete
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.deleteOne({ _id: review._id });

    // Update product rating stats
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });

    const totalRatings = reviews.length;
    const averageRating =
      totalRatings > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalRatings
        : 0;

    product.averageRating = averageRating;
    product.totalRatings = totalRatings;
    await product.save();

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
