// // import { Suspense } from "react"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Badge } from "@/components/ui/badge"
// // import { Star, MapPin, Heart, Shield, Verified } from "lucide-react"

// // // Use existing images in /public
// // const products = [
// //   {
// //     id: 1,
// //     name: "Handwoven Banarasi Silk Saree",
// //     price: 15000,
// //     image: "/banarasi-silk-saree.png",
// //     artisan: "Rajesh Kumar",
// //     location: "Varanasi, UP",
// //     rating: 4.8,
// //     category: "Textiles",
// //     verified: true,
// //     fairTrade: true,
// //   },
// //   {
// //     id: 2,
// //     name: "Madhubani Painting - Ganesha",
// //     price: 2500,
// //     image: "/madhubani-ganesha.png",
// //     artisan: "Sita Devi",
// //     location: "Madhubani, Bihar",
// //     rating: 4.9,
// //     category: "Art",
// //     verified: true,
// //     fairTrade: true,
// //   },
// //   {
// //     id: 3,
// //     name: "Bhagavad Gita (Sanskrit-Hindi)",
// //     price: 800,
// //     image: "/bhagavad-gita-sanskrit-hindi.png",
// //     artisan: "Gita Press",
// //     location: "Gorakhpur, UP",
// //     rating: 4.7,
// //     category: "Books",
// //     verified: true,
// //     fairTrade: false,
// //   },
// //   {
// //     id: 4,
// //     name: "Brass Diya Set (5 pieces)",
// //     price: 1200,
// //     image: "/traditional-brass-diyas.png",
// //     artisan: "Mohan Lal",
// //     location: "Moradabad, UP",
// //     rating: 4.6,
// //     category: "Handicrafts",
// //     verified: true,
// //     fairTrade: true,
// //   },
// // ]

// // export default function HeritageBazzarPage() {
// //   return (
// //     <div className="container mx-auto px-8 py-8">
// //       <div className="space-y-8">
// //         {/* Header */}
// //         <div className="text-center space-y-4">
// //           <div className="flex items-center justify-center space-x-2 mb-4">
// //             <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
// //               <span className="text-white font-bold text-lg font-devanagari">हे</span>
// //             </div>
// //             <h1 className="text-3xl lg:text-4xl font-bold">HeritageBazzar</h1>
// //             <Shield className="h-6 w-6 text-green-600" />
// //           </div>
// //           <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
// //             <Verified className="w-4 h-4 mr-2" />
// //             All Artisans Verified • Fair Trade Certified
// //           </div>
// //         </div>

// //         {/* Categories */}
// //         <div className="flex flex-wrap gap-2 justify-center">
// //           {["All", "Textiles", "Art", "Books", "Handicrafts", "Jewelry", "Pottery", "Fair Trade"].map((category) => (
// //             <Badge
// //               key={category}
// //               variant="outline"
// //               className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
// //             >
// //               {category}
// //             </Badge>
// //           ))}
// //         </div>

// //         {/* Products Grid */}
// //         <Suspense fallback={<div>Loading authentic products...</div>}>
// //           <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //             {products.map((product) => (
// //               <Card key={product.id} className="group hover:shadow-lg transition-shadow">
// //                 <CardHeader className="p-0">
// //                   <div className="relative overflow-hidden rounded-t-lg">
// //                     <img
// //                       src={product.image || "/placeholder.svg"}
// //                       alt={product.name}
// //                       className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
// //                     />
// //                     <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
// //                       <Heart className="h-4 w-4" />
// //                     </Button>
// //                     <div className="absolute top-2 left-2 flex flex-col gap-1">
// //                       <Badge className="bg-green-600">{product.category}</Badge>
// //                       {product.verified && (
// //                         <Badge variant="secondary" className="bg-blue-100 text-blue-800">
// //                           <Verified className="h-3 w-3 mr-1" />
// //                           Verified
// //                         </Badge>
// //                       )}
// //                       {product.fairTrade && (
// //                         <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
// //                           Fair Trade
// //                         </Badge>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </CardHeader>
// //                 <CardContent className="p-4 space-y-3">
// //                   <div>
// //                     <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
// //                     <CardDescription className="flex items-center space-x-1 mt-1">
// //                       <MapPin className="h-3 w-3" />
// //                       <span>{product.location}</span>
// //                     </CardDescription>
// //                   </div>

// //                   <div className="flex items-center justify-between">
// //                     <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
// //                     <div className="flex items-center space-x-1">
// //                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
// //                       <span className="text-sm">{product.rating}</span>
// //                     </div>
// //                   </div>

// //                   <div className="text-sm text-muted-foreground">
// //                     by <span className="font-medium">{product.artisan}</span>
// //                   </div>

// //                   <Button className="w-full bg-green-600 hover:bg-green-700">Support Artisan</Button>
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>
// //         </Suspense>

// //         {/* Impact Stats */}
// //         <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-8">
// //           <h3 className="text-2xl font-bold text-center mb-6">Rural Economy Impact</h3>
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
// //             <div>
// //               <div className="text-3xl font-bold text-green-600">1,200+</div>
// //               <div className="text-sm text-muted-foreground">Verified Artisans</div>
// //             </div>
// //             <div>
// //               <div className="text-3xl font-bold text-green-600">₹2.5Cr+</div>
// //               <div className="text-sm text-muted-foreground">Direct Income Generated</div>
// //             </div>
// //             <div>
// //               <div className="text-3xl font-bold text-green-600">500+</div>
// //               <div className="text-sm text-muted-foreground">Villages Supported</div>
// //             </div>
// //             <div>
// //               <div className="text-3xl font-bold text-green-600">95%</div>
// //               <div className="text-sm text-muted-foreground">Fair Trade Certified</div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import { useProductStore } from "@/store/useProductStore";
// import { useCartStore } from "@/store/useCartStore";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { Star } from "lucide-react";

// const categories = [
//   "All",
//   "Handicrafts",
//   "Textiles",
//   "Paintings",
//   "Jewelry",
//   "Sculptures",
//   "Books",
//   "Other",
// ];

// export default function HeritageBazzar() {
//   const navigate = useNavigate();
//   const { products, fetchProducts, isLoading, pages } = useProductStore();
//   const { addToCart } = useCartStore();

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [page, setPage] = useState(1);

//   // Fetch products whenever search, category, or page changes
//   useEffect(() => {
//     fetchProducts({ keyword: search, category: category === "All" ? "" : category, page });
//   }, [search, category, page]);

//   const handleAddToCart = async (productId: string) => {
//     await addToCart(productId, 1);
//     toast.success("Added to cart!");
//   };

//   return (
//     <div className="container mx-auto px-6 py-10 space-y-8">
//       {/* Top Header */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 relative">
//         <div className="flex-1"></div>

//         <h1 className="text-3xl font-bold tracking-tight text-center flex-1">
//           🛍️ HeritageBazzar — Authentic Indian Crafts
//         </h1>

//         <div className="flex gap-4 flex-1 justify-end">
//           <Button
//             onClick={() => navigate("/heritagebazzar/cart")}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             View Cart
//           </Button>
//           <Button
//             onClick={() => navigate("/heritagebazzar/orders")}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             My Orders
//           </Button>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="flex justify-center">
//         <Input
//           type="text"
//           placeholder="Search for crafts, textiles, books..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="max-w-xl w-full"
//         />
//       </div>

//       {/* Category Filter */}
//       <div className="flex flex-wrap gap-3 justify-center mt-4">
//         {categories.map((cat) => (
//           <Button
//             key={cat}
//             variant={cat === category ? "default" : "outline"}
//             onClick={() => {
//               setCategory(cat);
//               setPage(1);
//             }}
//           >
//             {cat}
//           </Button>
//         ))}
//       </div>

//       {/* Product Grid */}
//       <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
//         {isLoading
//           ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[300px] rounded-lg" />)
//           : products.length > 0
//           ? products.map((product) => (
//               <Card
//                 key={product._id}
//                 className="hover:shadow-lg transition cursor-pointer"
//                 onClick={() => navigate(`/product/${product._id}`)}
//               >
//                 <img
//                   src={product.image.url || "/placeholder.svg"}
//                   alt={product.name}
//                   className="w-full h-48 object-cover rounded-t-lg"
//                 />
//                 <CardHeader>
//                   <CardTitle className="text-lg font-semibold line-clamp-1">{product.name}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <span className="text-green-700 font-bold text-lg">
//                       ₹{product.price.toLocaleString()}
//                     </span>
//                     <div className="flex items-center gap-1 text-yellow-500">
//                       {Array.from({ length: 5 }).map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-4 h-4 ${
//                             i < Math.round(product.averageRating || 0) ? "fill-yellow-400" : "fill-muted"
//                           }`}
//                         />
//                       ))}
//                       <span className="text-xs text-muted-foreground ml-1">
//                         ({product.totalRatings || 0})
//                       </span>
//                     </div>
//                   </div>

//                   <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

//                   <Button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleAddToCart(product._id);
//                     }}
//                     className="w-full bg-amber-600 hover:bg-amber-700 mt-2"
//                   >
//                     Add to Cart
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))
//           : (
//             <p className="text-center col-span-full text-muted-foreground">
//               No products found in this category.
//             </p>
//           )}
//       </div>

//       {/* Pagination */}
//       {pages > 1 && (
//         <div className="flex justify-center items-center gap-4 mt-8">
//           <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
//             Previous
//           </Button>
//           <span className="font-medium">
//             Page {page} of {pages}
//           </span>
//           <Button variant="outline" disabled={page === pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>
//             Next
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star,
  Search,
  ShoppingBag,
  ShieldCheck,
  ShoppingCart,
  PackageCheck,
  Store
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const categories = [
  "All",
  "Handicrafts",
  "Textiles",
  "Paintings",
  "Jewelry",
  "Sculptures",
  "Books",
  "Other",
];

export default function HeritageBazzar() {
  const navigate = useNavigate();
  const { products, fetchProducts, isLoading, pages } = useProductStore();
  const { addToCart } = useCartStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts({
      keyword: search,
      category: category === "All" ? "" : category,
      page
    });
  }, [search, category, page, fetchProducts]);

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    await addToCart(productId, 1);
    toast.success("Added to your collection!");
  };

  const { authUser } = useAuthStore()

  return (
    <div className="container mx-auto px-6 py-10 space-y-10">

      {/* --- Top Header (Matched to TV Style) --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              HeritageBazzar
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Artisan Verified Marketplace
            </p>
          </div>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crafts, textiles..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 rounded-full bg-muted/50 focus-visible:ring-emerald-500"
            />
          </div>
          <Button onClick={() => navigate("/heritagebazzar/cart")} variant="outline" className="rounded-full gap-2">
            <ShoppingCart size={18} /> Cart
          </Button>
          <Button onClick={() => navigate("/heritagebazzar/orders")} variant="outline" className="rounded-full gap-2">
            <PackageCheck size={18} /> Orders
          </Button>
          {
            authUser?.roles.includes("SELLER") && <Button
              onClick={() => navigate("/heritagebazzar/dashboard")}
              variant="secondary"
              className="rounded-full gap-2 border border-emerald-100 hover:bg-emerald-50 transition-colors hover:dark:text-black"
            >
              <Store className="w-4 h-4 text-emerald-600" />
              Seller Dashboard
            </Button>
          }
        </div>
      </div>

      {/* --- Category Pills --- */}
      <div className="flex flex-wrap gap-2 justify-start pb-2 border-b">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={cat === category ? "default" : "ghost"}
            size="sm"
            onClick={() => { setCategory(cat); setPage(1); }}
            className={`rounded-full px-5 transition-all ${cat === category ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
              }`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* --- Product Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))
          : products.length > 0
            ? products.map((product) => (
              <Card
                key={product._id}
                className="group cursor-pointer overflow-hidden rounded-xl border-2 border-muted bg-card transition-all hover:border-emerald-500/50 hover:shadow-md"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Landscape Image - Saves height without sacrificing font size */}
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={product.image?.url || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-emerald-600/90 text-[10px] text-white backdrop-blur-md border-none px-2 py-0.5">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                {/* Content Section - Balanced Font Sizes */}
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1 text-base font-bold transition-colors group-hover:text-emerald-600">
                      {product.name}
                    </CardTitle>
                    {/* Description kept at text-sm for readability */}
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </div>

                  {/* Price and Action Row */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-emerald-700 leading-none">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-muted-foreground">
                          {(product.averageRating || 4.5).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Button with enough hit-area but compact height */}
                    <Button
                      size="sm"
                      className="h-9 px-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2 font-medium"
                      onClick={(e) => handleAddToCart(e, product._id)}
                    >
                      <ShoppingCart size={15} />
                      <span className="hidden sm:inline">Add</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
            : (
              <div className="col-span-full py-24 text-center space-y-5">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30" />
                <p className="text-xl font-semibold">No crafts found in this collection</p>
                <Button variant="outline" className="rounded-full" onClick={() => { setSearch(""); setCategory("All"); }}>
                  Clear Filters
                </Button>
              </div>
            )}
      </div>

      {/* --- Pagination --- */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6 border-t">
          <Button variant="outline" size="sm" className="rounded-full" disabled={page === 1}
            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Prev
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: pages }).map((_, i) => (
              <Button key={i} variant={page === i + 1 ? "default" : "ghost"} size="icon"
                className={`w-9 h-9 rounded-full ${page === i + 1 ? "bg-emerald-600" : ""}`}
                onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                {i + 1}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="rounded-full" disabled={page === pages}
            onClick={() => { setPage(p => Math.min(pages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}