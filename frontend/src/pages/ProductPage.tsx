// import { useEffect, useState } from "react";
// import { useParams } from "react-router";
// import { useProductStore } from "@/store/useProductStore";
// import { useCartStore } from "@/store/useCartStore";
// import { useAuthStore } from "@/store/useAuthStore";
// import { toast } from "sonner";
// import { Star } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// // 👇 Import the Review store and interface
// import { useReviewStore, type Review } from "@/store/useReviewStore";

// interface ReviewPayload {
//   rating: number;
//   comment: string;
// }

// export default function ProductPage() {
//   const { id } = useParams<{ id: string }>();
//   const { product, fetchProductById, isLoading } = useProductStore();
//   const { authUser } = useAuthStore();
//   const { addToCart } = useCartStore();
//   // 👇 Use the Review store state and actions
//   const { reviews, fetchProductReviews, addOrUpdateReview, isSubmitting } =
//     useReviewStore();
//   const [review, setReview] = useState<ReviewPayload>({ rating: 5, comment: "" });

//   // Removed: const [submittingReview, setSubmittingReview] = useState(false);
//   // Replaced with: const isSubmitting = useReviewStore(state => state.isSubmitting);

//   useEffect(() => {
//     if (id) {
//       fetchProductById(id);
//       // 👇 Fetch reviews using the store when the product ID is available
//       fetchProductReviews(id);
//     }
//   }, [id, fetchProductById, fetchProductReviews]);

//   const handleAddToCart = async () => {
//     if (!product) return;
//     await addToCart(product._id, 1);
//     toast.success("Added to cart!");
//   };

//   // 👇 Updated to use the addOrUpdateReview action from useReviewStore
//   const handleSubmitReview = async () => {
//     if (!product || !id) return;
//     if (!review.comment) {
//       toast.error("Please add a comment.");
//       return;
//     }

//     // The store action handles the submission state (isSubmitting) and refreshing reviews
//     await addOrUpdateReview(id, review);

//     // Refresh product data to update the average rating and total reviews displayed on the product details section
//     fetchProductById(id);

//     // Clear form only if submission was successful (the store handles the toast message)
//     setReview({ rating: 5, comment: "" });
//   };

//   if (isLoading || !product) {
//     return <div className="text-center py-20 text-muted-foreground">Loading product...</div>;
//   }

//   return (
//     <div className="container mx-auto px-6 py-10 space-y-8">
//       {/* Product Info */}
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Images */}
//         <div>
//           <img
//             src={product.image.url || "/placeholder.svg"}
//             alt={product.name}
//             className="w-full h-[400px] object-cover rounded-lg"
//           />
//         </div>

//         {/* Details */}
//         <div className="space-y-4">
//           <h1 className="text-3xl font-bold">{product.name}</h1>
//           <p className="text-muted-foreground">{product.description}</p>
//           <div className="flex items-center gap-2">
//             <span className="text-xl font-bold text-green-700">
//               ₹{product.price.toLocaleString()}
//             </span>
//             {product.stock <= 0 && (
//               <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
//             )}
//           </div>
//           <div className="flex items-center gap-1">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <Star
//                 key={i}
//                 className={`w-5 h-5 ${i < Math.round(product.averageRating!)
//                     ? "fill-yellow-400 text-yellow-400"
//                     : "fill-muted"
//                   }`}
//               />
//             ))}
//             <span className="text-sm text-muted-foreground ml-2">
//               ({product.totalRatings} reviews)
//             </span>
//           </div>

//           <div className="space-y-2">
//             <div className="text-sm text-muted-foreground">
//               Seller: <span className="font-medium">{product.seller?.firstName}</span>
//             </div>
//             <div className="flex gap-2">
//               <Button
//                 onClick={handleAddToCart}
//                 disabled={product.stock <= 0}
//                 className="bg-green-600 hover:bg-green-700"
//               >
//                 Add to Cart
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Reviews */}
//       <div className="space-y-4">
//         <h2 className="text-2xl font-bold">Reviews</h2>
//         {/* 👇 Use reviews from useReviewStore */}
//         {reviews.length === 0 ? (
//           <p className="text-muted-foreground">No reviews yet.</p>
//         ) : (
//           // Note: Casting r to Review interface for better type safety
//           reviews.map((r: Review) => (
//             <Card key={r._id} className="p-4">
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   <span>{r.user?.firstName || "Anonymous"}</span>
//                   <div className="flex gap-1">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`w-4 h-4 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted"
//                           }`}
//                       />
//                     ))}
//                   </div>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-muted-foreground">{r.comment}</p>
//                 <span className="text-xs text-muted-foreground">
//                   {new Date(r.createdAt).toLocaleDateString()}
//                 </span>
//               </CardContent>
//             </Card>
//           ))
//         )}

//         {/* Add Review Form */}
//         {authUser && (
//           <Card className="p-4">
//             <h3 className="font-bold mb-2">Leave a Review</h3>
//             <div className="flex flex-col gap-2">
//               <div className="flex items-center gap-2">
//                 <label className="text-sm font-medium">Rating:</label>
//                 <Input
//                   type="number"
//                   min={1}
//                   max={5}
//                   value={review.rating}
//                   onChange={(e) =>
//                     setReview((prev) => ({ ...prev, rating: Number(e.target.value) }))
//                   }
//                   className="w-16"
//                 />
//               </div>
//               <Textarea
//                 placeholder="Write your review..."
//                 value={review.comment}
//                 onChange={(e) =>
//                   setReview((prev) => ({ ...prev, comment: e.target.value }))
//                 }
//               />
//               <Button
//                 onClick={handleSubmitReview}
//                 disabled={isSubmitting} // 👇 Use isSubmitting from useReviewStore
//                 className="bg-amber-600 hover:bg-amber-700"
//               >
//                 {isSubmitting ? "Submitting..." : "Submit Review"}
//               </Button>
//             </div>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router"; // Added useNavigate
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Star, ArrowLeft, ShoppingCart, Store } from "lucide-react"; // Added Icons
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useReviewStore, type Review } from "@/store/useReviewStore";

interface ReviewPayload {
  rating: number;
  comment: string;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // For the back button
  const { product, fetchProductById, isLoading } = useProductStore();
  const { authUser } = useAuthStore();
  const { addToCart } = useCartStore();
  const { reviews, fetchProductReviews, addOrUpdateReview, isSubmitting } = useReviewStore();
  const [review, setReview] = useState<ReviewPayload>({ rating: 5, comment: "" });

  useEffect(() => {
    if (id) {
      fetchProductById(id);
      fetchProductReviews(id);
    }
  }, [id, fetchProductById, fetchProductReviews]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product._id, 1);
    toast.success("Added to cart!");
  };

  const handleSubmitReview = async () => {
    if (!product || !id) return;
    if (!review.comment) {
      toast.error("Please add a comment.");
      return;
    }
    await addOrUpdateReview(id, review);
    fetchProductById(id);
    setReview({ rating: 5, comment: "" });
  };

  if (isLoading || !product) {
    return <div className="text-center py-20 text-muted-foreground">Loading product...</div>;
  }

  return (
    // Increased padding on sides: px-8 to px-16
    <div className="container mx-auto px-8 md:px-12 lg:px-16 py-10 space-y-8">
      
      {/* --- Go Back Button --- */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="gap-2 text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 -ml-4"
      >
        <ArrowLeft size={18} />
        Back to Bazaar
      </Button>

      {/* Product Info */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="overflow-hidden rounded-2xl border shadow-sm">
          <img
            src={product.image.url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.averageRating!)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                    }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                ({product.totalRatings} reviews)
              </span>
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-4 border-y py-4">
            <span className="text-3xl font-bold text-emerald-700">
              ₹{product.price.toLocaleString()}
            </span>
            {product.stock <= 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase">
                Out of Stock
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Store className="w-4 h-4" />
              Seller: <span className="font-bold text-foreground">{product.seller?.firstName}</span>
            </div>

            {/* --- Updated Cart Button Style --- */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              size="lg"
              className="w-full md:w-auto px-12 h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-3 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-6 pt-10">
        <h2 className="text-2xl font-bold border-b pb-4">Customer Reviews</h2>
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Reviews List */}
          <div className="md:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              reviews.map((r: Review) => (
                <Card key={r._id} className="border-none bg-muted/30 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>{r.user?.firstName || "Anonymous"}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted"}`}
                          />
                        ))}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-tighter">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="md:col-span-1">
            {authUser && (
              <Card className="p-6 border-2 border-emerald-50">
                <h3 className="font-bold mb-4">Write a Review</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Rating</label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={review.rating}
                      onChange={(e) =>
                        setReview((prev) => ({ ...prev, rating: Number(e.target.value) }))
                      }
                      className="w-20 focus-visible:ring-emerald-500"
                    />
                  </div>
                  <Textarea
                    placeholder="Tell others about this product..."
                    className="min-h-[100px] focus-visible:ring-emerald-500"
                    value={review.comment}
                    onChange={(e) =>
                      setReview((prev) => ({ ...prev, comment: e.target.value }))
                    }
                  />
                  <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}