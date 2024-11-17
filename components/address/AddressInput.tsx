// components/address/AddressInput.tsx
import React, { useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, HelpCircle } from 'lucide-react'
import { useAddressData } from '@/hooks/useAddressData'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useToast } from "@/components/ui/use-toast"
import type { Toast } from "@/components/ui/use-toast"

export default function AddressInput() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { inputData, setInputData, handleFileUpload } = useFileUpload()
  const { addOrUpdateAddresses, setIsLoading, isLoading } = useAddressData()
  const { toast } = useToast()

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const lines = inputData.trim().split('\n')
      const parsedData = lines.map(line => {
        const [address, amount] = line.split(',').map(item => item.trim())
        return { address, amount: Math.round(parseFloat(amount) || 0) }
      }).filter(item => item.address && !isNaN(item.amount))

      if (parsedData.length === 0) {
        toast({
          title: "No valid data",
          description: "Please check your input format and try again.",
          variant: "destructive",
        } as Toast)
        return
      }

      addOrUpdateAddresses(parsedData)
      setInputData('')
      toast({
        title: "Data processed",
        description: `${parsedData.length} entries have been added or updated.`,
      } as Toast)
    } catch (error) {
      toast({
        title: "Error processing data",
        description: "There was an error processing your input.",
        variant: "destructive",
      } as Toast)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const result = await handleFileUpload(file)
      if (result.success && result.data) {
        addOrUpdateAddresses(result.data)
        toast({
          title: "File processed",
          description: `${result.data.length} entries have been added or updated.`,
        } as Toast)
      } else {
        toast({
          title: "Error processing file",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        } as Toast)
      }
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "There was an error processing your file.",
        variant: "destructive",
      } as Toast)
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
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
          disabled={isLoading}
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