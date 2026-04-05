import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Star } from "lucide-react"

const videos = [
  {
    id: 1,
    title: "How to Celebrate Diwali: Complete Guide",
    description: "Learn the traditional way to celebrate the festival of lights, from rangoli making to puja rituals.",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Diwali+Celebration",
    duration: "15:30",
    views: "125K",
    rating: 4.8,
    category: "Festivals",
    instructor: "Pandit Ramesh Sharma",
  },
  {
    id: 2,
    title: "Ganesh Chaturthi: Traditions and Rituals",
    description: "Discover the significance of Lord Ganesha's festival and learn how to perform the traditional puja.",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Ganesh+Chaturthi",
    duration: "12:45",
    views: "89K",
    rating: 4.9,
    category: "Festivals",
    instructor: "Dr. Meera Kulkarni",
  },
  {
    id: 3,
    title: "Classical Indian Music: Ragas Explained",
    description: "An introduction to the concept of ragas in Indian classical music and their emotional significance.",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Classical+Music",
    duration: "20:15",
    views: "67K",
    rating: 4.7,
    category: "Music",
    instructor: "Ustad Ahmed Khan",
  },
  {
    id: 4,
    title: "Yoga and Meditation: Ancient Practices",
    description: "Learn the traditional forms of yoga and meditation as described in ancient Indian texts.",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Yoga+Meditation",
    duration: "18:20",
    views: "156K",
    rating: 4.9,
    category: "Spirituality",
    instructor: "Swami Ananda",
  },
  {
    id: 5,
    title: "Holi: Colors and Traditions",
    description: "Understand the cultural significance of Holi and learn about regional variations in celebration.",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Holi+Festival",
    duration: "14:10",
    views: "98K",
    rating: 4.6,
    category: "Festivals",
    instructor: "Prof. Sunita Agarwal",
  },
  {
    id: 6,
    title: "Sanskrit Pronunciation Guide",
    description:
      "Master the correct pronunciation of Sanskrit words and understand the importance of proper recitation.",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Sanskrit+Guide",
    duration: "25:30",
    views: "45K",
    rating: 4.8,
    category: "Language",
    instructor: "Dr. Vishnu Prasad",
  },
]

const categories = ["All", "Festivals", "Music", "Dance", "Spirituality", "Language", "Art", "Cooking"]

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold">Learning Hub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore curated videos about Indian festivals, cultural practices, traditions, and learn the "how-tos" of
            our rich heritage.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Button size="icon" className="bg-white/90 hover:bg-white text-black rounded-full">
                    <Play className="h-6 w-6 ml-1" />
                  </Button>
                </div>
                <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">{video.duration}</Badge>
                <Badge className="absolute top-2 left-2" variant="secondary">
                  {video.category}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary cursor-pointer">
                  {video.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">{video.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="text-sm text-muted-foreground">
                  by <span className="font-medium">{video.instructor}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{video.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{video.rating}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
