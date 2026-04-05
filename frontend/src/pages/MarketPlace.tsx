import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Heart } from "lucide-react"

// Use the provided public images
const products = [
  {
    id: 1,
    name: "Handwoven Banarasi Silk Saree",
    price: 15000,
    image: "/banarasi-silk-saree.png",
    artisan: "Rajesh Kumar",
    location: "Varanasi, UP",
    rating: 4.8,
    category: "Textiles",
  },
  {
    id: 2,
    name: "Madhubani Painting - Ganesha",
    price: 2500,
    image: "/madhubani-ganesha.png",
    artisan: "Sita Devi",
    location: "Madhubani, Bihar",
    rating: 4.9,
    category: "Art",
  },
  {
    id: 3,
    name: "Bhagavad Gita (Sanskrit-Hindi)",
    price: 800,
    image: "/bhagavad-gita-sanskrit-hindi.png",
    artisan: "Gita Press",
    location: "Gorakhpur, UP",
    rating: 4.7,
    category: "Books",
  },
  {
    id: 4,
    name: "Brass Diya Set (5 pieces)",
    price: 1200,
    image: "/traditional-brass-diyas.png",
    artisan: "Mohan Lal",
    location: "Moradabad, UP",
    rating: 4.6,
    category: "Handicrafts",
  },
]

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold">Heritage Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover authentic Indian handicrafts, traditional books, and cultural artifacts directly from skilled
            artisans across India.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {["All", "Textiles", "Art", "Books", "Handicrafts", "Jewelry", "Pottery"].map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Products Grid */}
        <Suspense fallback={<div>Loading products...</div>}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute top-2 left-2">{product.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{product.location}</span>
                    </CardDescription>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    by <span className="font-medium">{product.artisan}</span>
                  </div>

                  <Button className="w-full">Add to Cart</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  )
}
