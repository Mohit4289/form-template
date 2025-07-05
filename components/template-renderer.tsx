"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"
import type { Template, Field } from "@/app/page"

interface TemplateRendererProps {
  template: Template
  onBack: () => void
}

export function TemplateRenderer({ template, onBack }: TemplateRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Form submitted successfully! Check console for data.")
  }

  const renderField = (field: Field) => {
    const value = formData[field.id] || ""

    switch (field.type) {
      case "label":
        const HeadingTag = field.labelStyle || "h2"
        const headingClasses = {
          h1: "text-3xl font-bold",
          h2: "text-2xl font-semibold",
          h3: "text-xl font-medium",
        }

        return (
          <div key={field.id} className="mb-4">
            <HeadingTag className={headingClasses[field.labelStyle || "h2"]}>{field.label}</HeadingTag>
          </div>
        )

      case "text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="text"
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        )

      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        )

      case "boolean":
        return (
          <div key={field.id} className="space-y-4">
            <Label className="text-base font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-checkbox`}
                  checked={value === true}
                  onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                />
                <Label htmlFor={`${field.id}-checkbox`}>Checkbox</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`${field.id}-switch`}
                  checked={value === true}
                  onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                />
                <Label htmlFor={`${field.id}-switch`}>Toggle</Label>
              </div>
            </div>
          </div>
        )

      case "enum":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(selectedValue) => handleFieldChange(field.id, selectedValue)}
              required={field.required}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{template.name}</h1>
          <p className="text-muted-foreground">{template.description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {template.sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">{section.fields.map(renderField)}</CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Submit Form
          </Button>
        </div>
      </form>
    </div>
  )
}
