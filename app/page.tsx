"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Eye } from "lucide-react"
import { TemplateBuilder } from "@/components/template-builder"
import { TemplateRenderer } from "@/components/template-renderer"

export interface Field {
  id: string
  type: "label" | "text" | "number" | "boolean" | "enum"
  label: string
  required?: boolean
  placeholder?: string
  options?: string[] // for enum type
  labelStyle?: "h1" | "h2" | "h3" // for label type
}

export interface Section {
  id: string
  title: string
  fields: Field[]
}

export interface Template {
  id: string
  name: string
  description: string
  sections: Section[]
  createdAt: Date
}

export default function HomePage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [currentView, setCurrentView] = useState<"list" | "builder" | "renderer">("list")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

  const handleCreateTemplate = () => {
    if (templates.length >= 5) {
      alert("Maximum of 5 templates allowed")
      return
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: `Template ${templates.length + 1}`,
      description: "New template description",
      sections: [],
      createdAt: new Date(),
    }

    setEditingTemplate(newTemplate)
    setCurrentView("builder")
  }

  const handleSaveTemplate = (template: Template) => {
    if (templates.find((t) => t.id === template.id)) {
      setTemplates(templates.map((t) => (t.id === template.id ? template : t)))
    } else {
      setTemplates([...templates, template])
    }
    setCurrentView("list")
    setEditingTemplate(null)
  }

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template)
    setCurrentView("builder")
  }

  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setCurrentView("renderer")
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId))
  }

  if (currentView === "builder") {
    return (
      <TemplateBuilder
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onCancel={() => {
          setCurrentView("list")
          setEditingTemplate(null)
        }}
      />
    )
  }

  if (currentView === "renderer" && selectedTemplate) {
    return (
      <TemplateRenderer
        template={selectedTemplate}
        onBack={() => {
          setCurrentView("list")
          setSelectedTemplate(null)
        }}
      />
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Form Template Builder</h1>
        <p className="text-muted-foreground">Create and manage form templates with customizable fields and sections</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Templates ({templates.length}/5)</h2>
        <Button onClick={handleCreateTemplate} disabled={templates.length >= 5}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-4">Create your first form template to get started</p>
            <Button onClick={handleCreateTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{template.name}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewTemplate(template)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription className="line-clamp-2">{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                  <span>{template.sections.length} sections</span>
                  <span>{template.sections.reduce((acc, section) => acc + section.fields.length, 0)} fields</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)} className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleViewTemplate(template)} className="flex-1">
                    Preview
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
