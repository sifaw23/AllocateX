// components/layout/Header.tsx
import React from 'react'
import Image from 'next/image'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <div className="relative w-48 h-12 mb-4 sm:mb-0">
        <Image
          src="/AllocateX.png"
          alt="AllocateX Logo"
          layout="fill"
          objectFit="contain"
          className="dark:hidden"
        />
        <Image
          src="/AllocateX-dark.png"
          alt="AllocateX Logo"
          layout="fill"
          objectFit="contain"
          className="hidden dark:block"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="dark-mode" className="text-sm font-medium">Dark Mode</Label>
        <Switch
          id="dark-mode"
          checked={darkMode}
          onCheckedChange={setDarkMode}
        />
      </div>
    </div>
  )
}

