import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Priya Mehta",
    role: "Cultural Historian",
    content:
      "This platform has revolutionized how we share and preserve Indian heritage. The AI assistant is incredibly knowledgeable about ancient texts.",
    avatar: "/placeholder-logo",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Artisan from Rajasthan",
    content:
      "Finally, a platform that connects us directly with customers worldwide. My handicrafts are now reaching people who truly appreciate our culture.",
    avatar: "/placeholder-logo",
    rating: 5,
  },
  {
    name: "Anita Sharma",
    role: "Student",
    content:
      "The learning videos helped me understand our festivals better. The community discussions are so enriching and educational.",
    avatar: "/placeholder-logoj",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="px-5 py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">What Our Community Says</h2>
          <p className="text-xl text-muted-foreground">
            Hear from artisans, scholars, and culture enthusiasts who are part of our heritage community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6 space-y-4">
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
