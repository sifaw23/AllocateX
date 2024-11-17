// app/page.tsx
'use client'

import React from 'react'
import { ToastProvider } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AddressInput from '@/components/address/AddressInput'
import AddressTable from '@/components/address/AddressTable'
import DataTools from '@/components/tools/DataTools'
import { useAddressData } from '@/hooks/useAddressData'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function EnhancedAllocateXPro() {
  const { darkMode, setDarkMode } = useDarkMode()
  const [activeTab, setActiveTab] = React.useState('addresses')

  return (
    <ToastProvider>
      <div className={`min-h-screen bg-background text-foreground ${darkMode ? 'dark' : ''}`}>
        <div className="container mx-auto p-4 max-w-4xl">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="tools">Data Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="addresses">
              <AddressInput />
              <AddressTable />
            </TabsContent>

            <TabsContent value="tools">
              <DataTools />
            </TabsContent>
          </Tabs>

          <Footer />
        </div>
      </div>
    </ToastProvider>
  )
}