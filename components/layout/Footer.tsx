// components/layout/Footer.tsx
import React from 'react'
import { Button } from "@/components/ui/button"
import { Twitter, Heart, Github } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

const Footer: React.FC = () => {
  const { toast } = useToast()

  const handleDonateClick = async () => {
    try {
      await navigator.clipboard.writeText('0x6b07602DbaACFd95d4a3A358438e39275538cc76')
      toast({
        title: "Address copied",
        description: "The donation address has been copied to your clipboard."
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy the address. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <footer className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center justify-center"
        onClick={() => window.open('https://x.com/Benzaid_Said_', '_blank')}
      >
        <Twitter className="mr-2 h-4 w-4" />
        Follow on X
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center justify-center"
        onClick={() => window.open('https://github.com/benzaid-said/allocatex', '_blank')}
      >
        <Github className="mr-2 h-4 w-4" />
        Star on GitHub
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center justify-center"
        onClick={handleDonateClick}
      >
        <Heart className="mr-2 h-4 w-4" />
        Donate ETH
      </Button>
    </footer>
  )
}

export default Footer