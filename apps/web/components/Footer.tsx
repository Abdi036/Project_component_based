import { Sparkles } from 'lucide-react'
import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 glass py-8 sm:py-12 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg">
              Code<span className="text-primary">Prep</span>
            </span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CodePrep. All rights reserved.
          </p>
        </div>
      </footer>
  )
}
