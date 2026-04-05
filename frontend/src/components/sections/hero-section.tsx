import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Verified } from "lucide-react"
import { Link } from "react-router"


export default function HeroSection() {
  return (
    <section className="px-5 relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-yellow-950/20">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)] py-16">
          {/* Text column */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                <Shield className="w-4 h-4 mr-2" />
                Trained on Verified Primary Sources Only
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 font-devanagari">
                  VIRASAT
                </span>
                <span className="block">Heritage Platform</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Experience authentic Indian heritage through Bhartiyam AI, shop at HeritageBazzar, learn from Dharohar
                TV, and connect with verified scholars on Sangam — all powered by primary literature and authoritative
                sources.
              </p>
            </div>


            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                asChild
                size="lg"
                className="text-lg px-8 bg-orange-600 text-white hover:bg-orange-700 transition-colors"
              >
                <Link to="/bhartiyam" className="flex items-center">
                  <span className="font-devanagari mr-2 text-2xl">ॐ</span>
                  Ask Bhartiyam AI
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                className="text-lg px-8 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                <Link to="/heritagebazzar">Explore HeritageBazzar</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <div className="font-devanagari text-orange-600 font-bold">भारतीयम्</div>
                <div className="text-xs text-muted-foreground">AI Chatbot</div>
              </div>
              <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <div className="font-devanagari text-red-600 font-bold">हेरिटेज</div>
                <div className="text-xs text-muted-foreground">Marketplace</div>
              </div>
              <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <div className="font-devanagari text-blue-600 font-bold">धरोहर</div>
                <div className="text-xs text-muted-foreground">Learning TV</div>
              </div>
              <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <div className="font-devanagari text-purple-600 font-bold">संगम</div>
                <div className="text-xs text-muted-foreground">Community</div>
              </div>
            </div>
          </div>

          {/* Image column */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 p-2 shadow-2xl">
              <img
                src="/dharmic-texts-collage.png"
                alt="Collage of Dharmic texts and heritage imagery"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Verified className="text-white h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Verified Sources</p>
                  <p className="text-sm text-muted-foreground">Primary Literature Only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
