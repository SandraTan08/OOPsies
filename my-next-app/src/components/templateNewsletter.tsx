'use client'

import axios from 'axios'
import { useState, useEffect } from 'react'
import { Save, Upload, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast, Toaster } from 'sonner'

export default function TemplateNewsletter() {
  const [templateName, setTemplateName] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [conclusion, setConclusion] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [templates, setTemplates] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('')

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/templateNewsletter')
      setTemplates(response.data)
    } catch (error) {
      toast.error('Failed to fetch templates')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name')
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', templateName)
      formData.append('introduction', introduction)
      formData.append('conclusion', conclusion)
      if (image) {
        formData.append('image', image)
      }

      await axios.post('http://localhost:8080/api/v1/templateNewsletter', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Template saved successfully')
      fetchTemplates()
      setTemplateName('')
      setIntroduction('')
      setConclusion('')
      setImage(null)
    } catch (error) {
      toast.error('Failed to save template')
    }
  }

  const handleRemoveTemplate = async () => {
    if (!selectedTemplate) return

    try {
      await axios.delete(`http://localhost:8080/api/v1/templateNewsletter/${selectedTemplate}`)
      toast.success('Template removed successfully')
      setSelectedTemplate('')
      fetchTemplates()
    } catch (error) {
      toast.error('Failed to remove template')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Toaster />
      <div className="space-y-2">
        <Label htmlFor="templateName">Template Name</Label>
        <Input
          id="templateName"
          placeholder="Enter template name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="introduction">Introduction</Label>
        <Textarea
          id="introduction"
          placeholder="Enter introduction text"
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conclusion">Conclusion</Label>
        <Textarea
          id="conclusion"
          placeholder="Enter conclusion text"
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Upload Image</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('image')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" /> Choose Image
          </Button>
          {image && <span className="text-sm text-muted-foreground">{image.name}</span>}
        </div>
      </div>

      <Button onClick={handleSaveTemplate}>
        <Save className="mr-2 h-4 w-4" /> Save Template
      </Button>

      <div className="space-y-2">
        <Label htmlFor="removeTemplate">Remove Existing Template</Label>
        <div className="flex items-center space-x-2">
          <select
            id="removeTemplate"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select template</option>
            {templates.map((template) => (
              <option key={template} value={template}>
                {template}
              </option>
            ))}
          </select>
          <Button variant="destructive" onClick={handleRemoveTemplate} disabled={!selectedTemplate}>
            <Trash2 className="mr-2 h-4 w-4" /> Remove
          </Button>
        </div>
      </div>
    </div>
  )
}