"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import * as React from "react"

export default function StickyHeader() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    document.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      document.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 py-2" : "bg-background py-4"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1
              className={cn(
                "font-bold transition-all duration-300",
                scrolled ? "text-xl" : "text-2xl"
              )}
            >
              Rant
            </h1>
            <p className="text-muted-foreground">
              Express your rant anonymously 🔐
            </p>
          </div>

          <nav className="hidden md:block">
            {/* <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-foreground hover:text-primary">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground hover:text-primary">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground hover:text-primary">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground hover:text-primary">
                  Contact
                </a>
              </li>
            </ul> */}
          </nav>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
