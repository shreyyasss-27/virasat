import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Store, Users, Video, Shield, Sparkles, Globe, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "Bhartiyam AI Chatbot",
    description:
      "AI assistant trained exclusively on verified primary literature and authentic cultural resources. Get accurate answers about Hindu sacred texts, traditions, and cultural practices.",
    color: "from-blue-500 to-cyan-500",
    objective: "Verified Primary Literature Training",
  },
  {
    icon: Store,
    title: "HeritageBazzar Marketplace",
    description:
      "Fair-trade digital marketplace for indigenous artisans, promoting sustainable livelihoods and supporting the rural economy with authentic handicrafts and cultural products.",
    color: "from-green-500 to-emerald-500",
    objective: "Rural Economy Support",
  },
  {
    icon: Video,
    title: "Dharohar TV Learning Platform",
    description:
      "Curated video platform hosting pre-recorded tutorials, workshops, and festival documentation showcasing India's traditions, practices, and heritage.",
    color: "from-purple-500 to-pink-500",
    objective: "Cultural Documentation",
  },
  {
    icon: Users,
    title: "Sangam Community Platform",
    description:
      "Secure and verified community platform for licensed temples, historians, and scholars to share knowledge and collaborate on heritage preservation.",
    color: "from-orange-500 to-red-500",
    objective: "Verified Expert Network",
  },
  {
    icon: Shield,
    title: "Authenticity Assurance",
    description:
      "Ensure accuracy of cultural information through AI models trained on primary, authoritative sources only, maintaining the integrity of ancient wisdom.",
    color: "from-indigo-500 to-purple-500",
    objective: "Primary Source Verification",
  },
  {
    icon: Globe,
    title: "Modern Relevance",
    description:
      "Make ancient wisdom relevant in modern contexts by enabling quick, fingertip access to accurate cultural, historical, and scientific knowledge.",
    color: "from-pink-500 to-rose-500",
    objective: "Contemporary Application",
  },
  {
    icon: TrendingUp,
    title: "Economic Impact",
    description:
      "Economically benefit the country by promoting traditional industries, increasing cultural tourism, and creating employment in the heritage sector.",
    color: "from-yellow-500 to-orange-500",
    objective: "Heritage Economy Growth",
  },
  {
    icon: Sparkles,
    title: "Cultural Preservation",
    description:
      "Comprehensive digital preservation of India's intangible cultural heritage through technology-enabled documentation and knowledge sharing.",
    color: "from-teal-500 to-cyan-500",
    objective: "Heritage Conservation",
  },
]

export default function FeaturesSection() {
  return (
    <section className="px-5 py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">Comprehensive Heritage Ecosystem</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Four integrated platforms working together to preserve, promote, and make accessible India's rich cultural
            heritage through verified, authentic sources.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <div className="text-sm text-primary font-medium">{feature.objective}</div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
