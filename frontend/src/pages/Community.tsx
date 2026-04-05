import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Heart, Share, Clock } from "lucide-react"

const discussions = [
  {
    id: 1,
    title: "What is the historical significance of the Kumbh Mela?",
    content:
      "I've always been fascinated by the Kumbh Mela and would love to understand its origins and why it's considered so sacred...",
    author: "Priya Sharma",
    avatar: "/placeholder-user.jpg",
    category: "Festivals",
    replies: 12,
    likes: 24,
    timeAgo: "2 hours ago",
    tags: ["KumbhMela", "Pilgrimage", "History"],
  },
  {
    id: 2,
    title: "Can someone explain the different types of classical Indian dance?",
    content:
      "I'm interested in learning about Bharatanatyam, Kathak, Odissi, and other classical dance forms. What are their unique characteristics?",
    author: "Dr. Rajesh Gupta",
    avatar: "/placeholder-user.jpg",
    category: "Arts",
    replies: 8,
    likes: 18,
    timeAgo: "4 hours ago",
    tags: ["Dance", "Classical", "Culture"],
  },
  {
    id: 3,
    title: "Seeking interpretation of this Sanskrit shloka from Mahabharata",
    content: "धर्मे च अर्थे च कामे च मोक्षे च भरतर्षभ। यदिहास्ति तदन्यत्र यन्नेहास्ति न तत्क्वचित्॥ Can someone help with the meaning?",
    author: "Anita Krishnan",
    avatar: "/placeholder-user.jpg",
    category: "Sanskrit",
    replies: 15,
    likes: 32,
    timeAgo: "6 hours ago",
    tags: ["Sanskrit", "Mahabharata", "Philosophy"],
  },
]

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold">Cultural Community</h1>
          <p className="text-xl text-muted-foreground">
            Connect with historians, scholars, and culture enthusiasts. Share knowledge and explore Indian heritage
            together.
          </p>
          <Button size="lg">Start New Discussion</Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {["All", "Mythology", "Festivals", "Sanskrit", "Arts", "History", "Philosophy", "Traditions"].map(
            (category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                {category}
              </Badge>
            ),
          )}
        </div>

        {/* Discussions */}
        <div className="space-y-6">
          {discussions.map((discussion) => (
            <Card key={discussion.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={discussion.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {discussion.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{discussion.author}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{discussion.timeAgo}</span>
                        <Badge variant="secondary" className="text-xs">
                          {discussion.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl hover:text-primary cursor-pointer">{discussion.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">{discussion.content}</CardDescription>

                <div className="flex flex-wrap gap-2">
                  {discussion.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{discussion.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{discussion.replies}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
