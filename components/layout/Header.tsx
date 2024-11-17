// components/layout/Header.tsx
import React from 'react'
import Image from 'next/image'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { HelpCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative w-48 h-12">
          <Image
            src="/AllocateX.png"
            alt="AllocateX Logo"
            layout="fill"
            objectFit="contain"
            className="dark:hidden"
          />
          <Image
            src="/AllocateX.png"
            alt="AllocateX Logo"
            layout="fill"
            objectFit="contain"
            className="hidden dark:block"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About AllocateX</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                AllocateX is a professional tool for managing and analyzing Ethereum address allocations.
                Features include:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Import/Export data in multiple formats (CSV, Excel, JSON)</li>
                <li>Powerful search and filtering capabilities</li>
                <li>Bulk address management</li>
                <li>Data analysis tools</li>
                <li>Dark mode support</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Version 2.0.0 - Last updated November 2024
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="dark-mode" className="text-sm font-medium">
          Dark Mode
        </Label>
        <Switch
          id="dark-mode"
          checked={darkMode}
          onCheckedChange={setDarkMode}
        />
      </div>
    </div>
  )
}

