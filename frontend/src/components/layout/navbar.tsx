import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Bot, Store, Users, Home, User, LogOut, Tv, ShoppingBag } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Link, NavLink } from "react-router"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/useAuthStore"

const navigation = [
  { name: "Home", to: "/", icon: Home },
  { name: "Bhartiyam AI", to: "/bhartiyam", icon: Bot },
  { name: "HeritageBazzar", to: "/heritagebazzar", icon: ShoppingBag },
  { name: "Dharohar TV", to: "/dharohar-tv", icon: Tv },
  { name: "Sangam", to: "/sangam", icon: Users },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { authUser, logout } = useAuthStore()

  return (
    <header className="px-10 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm"></span>
          </div>
          <span className="font-bold text-xl">Virasat</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-1 text-sm font-semibold transition-colors ${
                  isActive 
                    ? "text-orange-500" 
                    : "text-foreground hover:text-orange-400" // Darker base color
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />

          <div className="hidden md:block">
            {authUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center space-x-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center space-x-2 text-red-500 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col space-y-2 mt-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 text-lg font-bold p-3 rounded-md transition-colors w-full ${
                        isActive 
                          ? "text-orange-500 bg-orange-500/10" 
                          : "text-foreground hover:bg-accent"
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}

                <hr className="my-2 border-t" />

                {authUser ? (
                  <>
                    <NavLink
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 text-lg font-bold p-3 rounded-md transition-colors w-full ${
                          isActive ? "text-orange-500 bg-orange-500/10" : "text-foreground hover:bg-accent"
                        }`
                      }
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </NavLink>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-3 text-lg font-bold p-3 rounded-md text-red-500 hover:bg-red-500/10 w-full justify-start"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Log Out</span>
                    </Button>
                  </>
                ) : (
                  <Button asChild className="mx-3">
                    <Link to="/auth/signin" onClick={() => setIsOpen(false)}>Sign In</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}