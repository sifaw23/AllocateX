'use client'

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ArrowUpDown, Download, ChevronLeft, ChevronRight, Loader2, Twitter, Heart, Search, Upload, Trash2, Calendar, MessageSquare, Mail, FileText, UserX } from 'lucide-react'
import { utils, read, write } from 'xlsx'
import { saveAs } from 'file-saver'
import { Button } from "../components/ui/button"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../components/ui/table"
import { useToast, ToastProvider } from "../components/ui/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Textarea } from "../components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Checkbox } from "../components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

export default function EnhancedAllocateXPro() {
  const [inputData, setInputData] = useState('')
  const [tableData, setTableData] = useState<Array<{ address: string; amount: number }>>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const itemsPerPage = 10
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedAddresses, setSelectedAddresses] = useState<Set<string>>(new Set())
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')
  const [activeTab, setActiveTab] = useState('addresses')

  useEffect(() => {
    const savedData = localStorage.getItem('allocateXProData')
    if (savedData) {
      setTableData(JSON.parse(savedData))
    }
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('allocateXProData', JSON.stringify(tableData))
  }, [tableData])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const parseInput = useCallback((input: string) => {
    const lines = input.trim().split('\n')
    return lines.map(line => {
      const [address, amount] = line.split(',').map(item => item.trim())
      return { address, amount: Math.round(parseFloat(amount) || 0) }
    }).filter(item => item.address && !isNaN(item.amount))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(e.target.value)
  }

  const handleSubmit = useCallback(() => {
    setIsLoading(true)
    const parsedData = parseInput(inputData)
    setTableData(prevData => {
      const newData = [...prevData]
      parsedData.forEach(item => {
        const existingIndex = newData.findIndex(existing => existing.address === item.address)
        if (existingIndex !== -1) {
          newData[existingIndex].amount += item.amount
        } else {
          newData.push(item)
        }
      })
      return newData
    })
    setCurrentPage(1)
    setIsLoading(false)
    setInputData('')
    toast({
      title: "Data processed",
      description: `${parsedData.length} entries have been added or updated in the table.`,
    })
  }, [inputData, parseInput, toast])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsLoading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        let parsedData: Array<{ address: string; amount: number }> = []

        if (file.name.endsWith('.csv')) {
          // Parse CSV
          const lines = content.split('\n')
          parsedData = lines.map(line => {
            const [address, amount] = line.split(',').map(item => item.trim())
            return { address, amount: Math.round(parseFloat(amount) || 0) }
          }).filter(item => item.address && !isNaN(item.amount))
        } else {
          // Parse Excel
          const data = new Uint8Array(content.split('').map(char => char.charCodeAt(0)))
          const workbook = read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = utils.sheet_to_json(worksheet, { header: ['address', 'amount'] })
          parsedData = jsonData.map((row: any) => ({
            address: row.address,
            amount: Math.round(parseFloat(row.amount) || 0)
          })).filter((item: any) => item.address && !isNaN(item.amount))
        }

        setTableData(prevData => {
          const newData = [...prevData]
          parsedData.forEach(item => {
            const existingIndex = newData.findIndex(existing => existing.address === item.address)
            if (existingIndex !== -1) {
              newData[existingIndex].amount += item.amount
            } else {
              newData.push(item)
            }
          })
          return newData
        })
        setCurrentPage(1)
        setIsLoading(false)
        toast({
          title: "File processed",
          description: `${parsedData.length} entries have been added or updated in the table.`,
        })
      }
      reader.readAsText(file)
    }
  }, [toast])

  const sortedAndFilteredData = useMemo(() => {
    return [...tableData]
      .filter(item => item.address.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
      })
  }, [tableData, sortOrder, searchTerm])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedAndFilteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedAndFilteredData, currentPage])

  const pageCount = Math.ceil(sortedAndFilteredData.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(sortedAndFilteredData)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, "Addresses")
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(data, 'addresses.xlsx')
    toast({
      title: "Excel file downloaded",
      description: "Your data has been exported to an Excel file.",
    })
  }

  const downloadCSV = () => {
    const csvContent = sortedAndFilteredData.map(row => `${row.address},${row.amount}`).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'addresses.csv')
    toast({
      title: "CSV file downloaded",
      description: "Your data has been exported to a CSV file.",
    })
  }

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(sortedAndFilteredData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    saveAs(blob, 'addresses.json')
    toast({
      title: "JSON file downloaded",
      description: "Your data has been exported to a JSON file.",
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "The Ethereum address has been copied to your clipboard.",
      })
    } catch (err) {
      console.error('Failed to copy text: ', err)
      toast({
        title: "Copy failed",
        description: "Failed to copy the Ethereum address. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSelected = () => {
    setTableData(prevData => prevData.filter(item => !selectedAddresses.has(item.address)))
    setSelectedAddresses(new Set())
    setShowDeleteConfirm(false)
    toast({
      title: "Addresses deleted",
      description: `${selectedAddresses.size} addresses have been removed from the table.`,
    })
  }

  const handleSelectAddress = (address: string) => {
    setSelectedAddresses(prevSelected => {
      const newSelected = new Set(prevSelected)
      if (newSelected.has(address)) {
        newSelected.delete(address)
      } else {
        newSelected.add(address)
      }
      return newSelected
    })
  }

  const handleSelectAll = () => {
    if (selectedAddresses.size === paginatedData.length) {
      setSelectedAddresses(new Set())
    } else {
      setSelectedAddresses(new Set(paginatedData.map(item => item.address)))
    }
  }

  // New functions for enhanced features
  const formatDates = () => {
    const dateRegex = /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/g
    const formatted = inputData.replace(dateRegex, (match, p1, p2, p3) => {
      const [month, day, year] = dateFormat === 'MM/DD/YYYY' ? [p1, p2, p3] : [p2, p1, p3]
      return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
    })
    setInputData(formatted)
    toast({
      title: "Dates formatted",
      description: `Dates have been formatted to ${dateFormat}`,
    })
  }

  const analyzeTextSentiment = () => {
    const words = inputData.toLowerCase().split(/\s+/)
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic']
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'disappointing']

    const positiveCount = words.filter(word => positiveWords.includes(word)).length
    const negativeCount = words.filter(word => negativeWords.includes(word)).length

    const sentiment = positiveCount > negativeCount ? 'Positive' : 
                      positiveCount < negativeCount ? 'Negative' : 'Neutral'

    toast({
      title: "Sentiment Analysis Complete",
      description: `The overall sentiment is ${sentiment.toLowerCase()}. Positive words: ${positiveCount}, Negative words: ${negativeCount}`,
    })
  }

  const extractEmails = () => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const emails = inputData.match(emailRegex) || []
    setInputData(emails.join('\n'))
    toast({
      title: "Emails Extracted",
      description: `${emails.length} email addresses found and extracted.`,
    })
  }

  const anonymizeData = () => {
    const lines = inputData.split('\n')
    const anonymized = lines.map(line => {
      // Anonymize email addresses
      line = line.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 'email@redacted.com')
      // Anonymize phone numbers
      line = line.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, 'XXX-XXX-XXXX')
      // Anonymize names (assuming names are capitalized words)
      line = line.replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, 'John Doe')
      return line
    })
    setInputData(anonymized.join('\n'))
    toast({
      title: "Data Anonymized",
      description: "Sensitive information has been anonymized in the input.",
    })
  }

  return (
    <ToastProvider>
      <div className={`min-h-screen bg-background text-foreground ${darkMode ? 'dark' : ''}`}>
        <div className="container mx-auto p-4 max-w-4xl">
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="tools">Data Tools</TabsTrigger>
            </TabsList>
            <TabsContent value="addresses">
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
              {tableData.length > 0 && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                      <div className="relative w-full sm:w-auto mb-4 sm:mb-0 sm:flex-1 sm:mr-4">
                        <Input
                          type="text"
                          placeholder="Search addresses..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full bg-input text-foreground"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                      </div>
                      <div className="flex space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={downloadExcel}>Excel (.xlsx)</DropdownMenuItem>
                            <DropdownMenuItem onClick={downloadCSV}>CSV (.csv)</DropdownMenuItem>
                            <DropdownMenuItem onClick={downloadJSON}>JSON (.json)</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              disabled={selectedAddresses.size === 0}
                              className="flex items-center justify-center"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Selected
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                            </DialogHeader>
                            <p>Are you sure you want to delete {selectedAddresses.size} selected addresses?</p>
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                              <Button variant="destructive" onClick={handleDeleteSelected}>Delete</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div className="bg-card text-card-foreground rounded-md shadow overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">
                              <Checkbox
                                checked={selectedAddresses.size === paginatedData.length}
                                onCheckedChange={handleSelectAll}
                              />
                            </TableHead>
                            <TableHead className="text-muted-foreground">Address</TableHead>
                            <TableHead>
                              <Button 
                                variant="ghost" 
                                onClick={toggleSortOrder} 
                                className="flex items-center text-muted-foreground hover:text-foreground"
                              >
                                Amount
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead className="text-muted-foreground">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedData.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedAddresses.has(item.address)}
                                  onCheckedChange={() => handleSelectAddress(item.address)}
                                />
                              </TableCell>
                              <TableCell>
                                <span className="font-mono break-all">{item.address}</span>
                              </TableCell>
                              <TableCell>{item.amount}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(item.address)}
                                  className="text-foreground hover:text-primary-foreground hover:bg-primary"
                                >
                                  Copy
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                            />
                          </PaginationItem>
                          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => handlePageChange(Math.min(pageCount, currentPage + 1))}
                              disabled={currentPage === pageCount}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                      <div className="text-sm text-muted-foreground">
                        Total: {sortedAndFilteredData.length} entries
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </TabsContent>
            <TabsContent value="tools">
              <Card>
                <CardHeader>
                  <CardTitle>Data Processing Tools</CardTitle>
                  <CardDescription>Additional tools to process and analyze your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataInput">Input Data</Label>
                    <Textarea
                      id="dataInput"
                      placeholder="Enter your data here..."
                      value={inputData}
                      onChange={handleInputChange}
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select value={dateFormat} onValueChange={setDateFormat}>
                        <SelectTrigger id="dateFormat">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={formatDates} className="mt-auto">
                      <Calendar className="mr-2 h-4 w-4" />
                      Format Dates
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={analyzeTextSentiment}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Analyze Sentiment
                    </Button>
                    <Button onClick={extractEmails}>
                      <Mail className="mr-2 h-4 w-4" />
                      Extract Emails
                    </Button>
                    <Button onClick={anonymizeData}>
                      <UserX className="mr-2 h-4 w-4" />
                      Anonymize Data
                    </Button>
                    <Button onClick={downloadJSON}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export as JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
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
              onClick={() => copyToClipboard('0x6b07602DbaACFd95d4a3A358438e39275538cc76')}
            >
              <Heart className="mr-2 h-4 w-4" />
              Donate ETH
            </Button>
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}