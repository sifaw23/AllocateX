// components/address/AddressInput.tsx
import React, { useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload } from 'lucide-react'
import { useAddressData } from '@/hooks/useAddressData'
import { useFileUpload } from '@/hooks/useFileUpload'

export default function AddressInput() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isLoading, handleSubmit, handleFileUpload, inputData, handleInputChange } = useFileUpload()

  return (
    <div className="mb-6">
      <Textarea
        placeholder="Enter addresses and amounts (e.g., 0x123...,100)"
        value={inputData}
        onChange={handleInputChange}
        className="w-full h-32 bg-input text-foreground border-input mb-2"
      />
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button 
          onClick={handleSubmit} 
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90" 
          disabled={isLoading}
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
          className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".csv, .xlsx, .xls"
          className="hidden"
        />
      </div>
    </div>
  )
}