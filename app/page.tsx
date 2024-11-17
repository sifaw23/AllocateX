// app/page.tsx
'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddressProvider } from '@/context/AddressContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AddressInput from '@/components/address/AddressInput'
import AddressTable from '@/components/address/AddressTable'
import DataTools from '@/components/tools/DataTools'
import { useDarkMode } from '@/hooks/useDarkMode'
import { Toaster } from "@/components/ui/toaster"

export default function EnhancedAllocateXPro() {
  const { darkMode, setDarkMode, mounted } = useDarkMode()
  const [activeTab, setActiveTab] = React.useState('addresses')

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <AddressProvider>
      <main className={`min-h-screen bg-background text-foreground transition-colors ${darkMode ? 'dark' : ''}`}>
        <div className="container mx-auto p-4 max-w-4xl space-y-6">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />

          <div className="border rounded-lg bg-card p-4">
            <Tabs 
              defaultValue="addresses" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="tools">Data Tools</TabsTrigger>
              </TabsList>

              <TabsContent 
                value="addresses" 
                className="space-y-4 min-h-[400px]"
              >
                <AddressInput />
                <AddressTable />
              </TabsContent>

              <TabsContent 
                value="tools" 
                className="space-y-4 min-h-[400px]"
              >
                <DataTools />
              </TabsContent>
            </Tabs>
          </div>

          <Footer />
        </div>
      </main>
      <Toaster />
    </AddressProvider>
  )
}


export const dynamic = 'force-dynamic'
export const revalidate = 0