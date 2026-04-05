import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"
import { Link } from "react-router"

export default function Footer() {
  return (
    <footer className="px-5 bg-gray-900 text-white">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm font-devanagari"></span>
              </div>
              <span className="font-bold text-xl">Virasat</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Comprehensive heritage platform featuring verified AI chatbot, fair-trade marketplace, cultural learning
              TV, and expert community for preserving authentic Indian heritage.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Our Platforms</h3>
            <div className="space-y-2">
              <Link to="/bhartiyam" className="block text-gray-400 hover:text-white transition-colors">
                Bhartiyam AI
              </Link>
              <Link to="/heritagebazzar" className="block text-gray-400 hover:text-white transition-colors">
                HeritageBazzar
              </Link>
              <Link to="/dharohar-tv" className="block text-gray-400 hover:text-white transition-colors">
                Dharohar TV
              </Link>
              <Link to="/sangam" className="block text-gray-400 hover:text-white transition-colors">
                Sangam Community
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Explore Heritage</h3>
            <div className="space-y-2">
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors">
                Verified Sources
              </Link>
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors">
                Fair Trade Products
              </Link>
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors">
                Cultural Documentation
              </Link>
              <Link to="#" className="block text-gray-400 hover:text-white transition-colors">
                Expert Community
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Heritage Updates</h3>
            <p className="text-gray-400 text-sm">
              Get updates about new verified content, artisan products, cultural documentation, and expert discussions.
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Virasat - A Heritage Platform preserving and promoting Bharat.</p>
        </div>
      </div>
    </footer>
  )
}
