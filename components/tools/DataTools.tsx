// components/tools/DataTools.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, MessageSquare, Mail, FileText, UserX } from 'lucide-react'

interface DataToolsProps {}

const DataTools: React.FC<DataToolsProps> = () => {
  const [inputData, setInputData] = useState('')
  const [dateFormat, setDateFormat] = useState<'MM/DD/YYYY' | 'DD/MM/YYYY'>('MM/DD/YYYY')
  const { toast } = useToast()

  const formatDates = () => {
    try {
      const dateRegex = /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/g
      const formatted = inputData.replace(dateRegex, (match, p1, p2, p3) => {
        const [month, day, year] = dateFormat === 'MM/DD/YYYY' ? [p1, p2, p3] : [p2, p1, p3]
        return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
      })
      setInputData(formatted)
      toast({
        title: "Dates formatted",
        description: `Dates have been formatted to ${dateFormat}`
      })
    } catch (error) {
      toast({
        title: "Error formatting dates",
        description: "Please check your input and try again",
        variant: "destructive"
      })
    }
  }

  const analyzeTextSentiment = () => {
    try {
      const words = inputData.toLowerCase().split(/\s+/)
      const positiveWords = new Set(['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'])
      const negativeWords = new Set(['bad', 'poor', 'terrible', 'awful', 'horrible', 'disappointing'])

      const positiveCount = words.filter(word => positiveWords.has(word)).length
      const negativeCount = words.filter(word => negativeWords.has(word)).length

      const sentiment = positiveCount > negativeCount ? 'Positive' : 
                       positiveCount < negativeCount ? 'Negative' : 'Neutral'

      toast({
        title: "Sentiment Analysis Complete",
        description: `The overall sentiment is ${sentiment.toLowerCase()}. Positive words: ${positiveCount}, Negative words: ${negativeCount}`
      })
    } catch (error) {
      toast({
        title: "Error analyzing sentiment",
        description: "Please check your input and try again",
        variant: "destructive"
      })
    }
  }

  const extractEmails = () => {
    try {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
      const emails = inputData.match(emailRegex) || []
      setInputData(emails.join('\n'))
      toast({
        title: "Emails Extracted",
        description: `${emails.length} email addresses found and extracted.`
      })
    } catch (error) {
      toast({
        title: "Error extracting emails",
        description: "Please check your input and try again",
        variant: "destructive"
      })
    }
  }

  const anonymizeData = () => {
    try {
      const lines = inputData.split('\n')
      const anonymized = lines.map(line => {
        // Anonymize email addresses
        line = line.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 'email@redacted.com')
        // Anonymize phone numbers
        line = line.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, 'XXX-XXX-XXXX')
        // Anonymize Ethereum addresses
        line = line.replace(/0x[a-fA-F0-9]{40}/g, '0x...redacted')
        // Anonymize names (assuming names are capitalized words)
        line = line.replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, 'John Doe')
        return line
      })
      setInputData(anonymized.join('\n'))
      toast({
        title: "Data Anonymized",
        description: "Sensitive information has been anonymized in the input."
      })
    } catch (error) {
      toast({
        title: "Error anonymizing data",
        description: "Please check your input and try again",
        variant: "destructive"
      })
    }
  }

  return (
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
            onChange={(e) => setInputData(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select value={dateFormat} onValueChange={(value: 'MM/DD/YYYY' | 'DD/MM/YYYY') => setDateFormat(value)}>
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
          <Button onClick={() => {
            const blob = new Blob([inputData], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'processed_data.txt'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }}>
            <FileText className="mr-2 h-4 w-4" />
            Export Text
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DataTools