// components/address/AddressInput.tsx
import React, { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, HelpCircle, Trash2 } from 'lucide-react'
import { useAddressData } from '@/context/AddressContext'
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AddressInput() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [inputData, setInputData] = useState('')
  const [showClearDialog, setShowClearDialog] = useState(false)
  const { addOrUpdateAddresses, isLoading, setIsLoading, clearAllData } = useAddressData()
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!inputData.trim()) {
      toast({
        title: "No data",
        description: "Please enter some data first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const lines = inputData.trim().split('\n')
      const parsedData = lines
        .map(line => {
          const [address, amount] = line.split(',').map(item => item.trim())
          return { 
            address, 
            amount: Math.round(parseFloat(amount) || 0) 
          }
        })
        .filter(item => item.address && !isNaN(item.amount) && item.amount > 0)

      if (parsedData.length === 0) {
        toast({
          title: "No valid data",
          description: "Please check your input format and try again.",
          variant: "destructive",
        })
        return
      }

      addOrUpdateAddresses(parsedData)
      setInputData('')
      toast({
        title: "Data processed",
        description: `${parsedData.length} entries have been added or updated.`,
      })
    } catch (error) {
      console.error('Error processing data:', error)
      toast({
        title: "Error processing data",
        description: "There was an error processing your input.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const text = await file.text()
      const lines = text.trim().split('\n')
      const parsedData = lines
        .map(line => {
          const [address, amount] = line.split(',').map(item => item.trim())
          return {
            address,
            amount: Math.round(parseFloat(amount) || 0)
          }
        })
        .filter(item => item.address && !isNaN(item.amount) && item.amount > 0)

      if (parsedData.length === 0) {
        toast({
          title: "No valid data",
          description: "The file contains no valid data.",
          variant: "destructive",
        })
        return
      }

      addOrUpdateAddresses(parsedData)
      toast({
        title: "File processed",
        description: `${parsedData.length} entries have been added or updated.`,
      })
    } catch (error) {
      console.error('Error processing file:', error)
      toast({
        title: "Error processing file",
        description: "There was an error processing your file.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClearData = () => {
    clearAllData()
    setShowClearDialog(false)
    toast({
      title: "Data cleared",
      description: "All address data has been cleared.",
      variant: "default",
    })
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          Enter Addresses and Amounts
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => toast({
              title: "Input Format",
              description: "Enter one entry per line in the format: address,amount\nExample: 0x123...,100"
            })}
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </label>

        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear All Data</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to clear all address data? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowClearDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleClearData}>
                Clear All
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Textarea
        placeholder="0x123...,100&#10;0x456...,200"
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        className="h-32 font-mono"
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !inputData.trim()}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Process Data'
          )}
        </Button>

        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
          disabled={isLoading}
          className="flex-1"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls"
          className="hidden"
        />
      </div>
    </div>
  )
}