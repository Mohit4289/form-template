"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, ArrowLeft, GripVertical } from "lucide-react"
import type { Template, Section, Field } from "@/app/page"

interface TemplateBuilderProps {
  template: Template | null
  onSave: (template: Template) => void
  onCancel: () => void
}

export function TemplateBuilder({ template, onSave, onCancel }: TemplateBuilderProps) {
  const [currentTemplate, setCurrentTemplate] = useState<Template>(
    template || {
      id: Date.now().toString(),
      name: "New Template",
      description: "",
      sections: [],
      createdAt: new Date(),
    },
  )

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: `Section ${currentTemplate.sections.length + 1}`,
      fields: [],
    }
    setCurrentTemplate({
      ...currentTemplate,
      sections: [...currentTemplate.sections, newSection],
    })
  }

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setCurrentTemplate({
      ...currentTemplate,
      sections: currentTemplate.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section,
      ),
    })
  }

  const deleteSection = (sectionId: string) => {
    setCurrentTemplate({
      ...currentTemplate,
      sections: currentTemplate.sections.filter((section) => section.id !== sectionId),
    })
  }

  const addField = (sectionId: string, fieldType: Field["type"]) => {
    const newField: Field = {
      id: Date.now().toString(),
      type: fieldType,
      label: `New ${fieldType} field`,
      required: false,
      ...(fieldType === "label" && { labelStyle: "h2" }),
      ...(fieldType === "enum" && { options: ["Option 1", "Option 2"] }),
    }

    setCurrentTemplate({
      ...currentTemplate,
      sections: currentTemplate.sections.map((section) =>
        section.id === sectionId ? { ...section, fields: [...section.fields, newField] } : section,
      ),
    })
  }

  const updateField = (sectionId: string, fieldId: string, updates: Partial<Field>) => {
    setCurrentTemplate({
      ...currentTemplate,
      sections: currentTemplate.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)),
            }
          : section,
      ),
    })
  }

  const deleteField = (sectionId: string, fieldId: string) => {
    setCurrentTemplate({
      ...currentTemplate,
      sections: currentTemplate.sections.map((section) =>
        section.id === sectionId
          ? { ...section, fields: section.fields.filter((field) => field.id !== fieldId) }
          : section,
      ),
    })
  }

  const handleSave = () => {
    onSave(currentTemplate)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Template Builder</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={currentTemplate.name}
              onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              value={currentTemplate.description}
              onChange={(e) => setCurrentTemplate({ ...currentTemplate, description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {currentTemplate.sections.map((section, sectionIndex) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    className="font-semibold"
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteSection(section.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <Card key={field.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium capitalize">{field.type}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => deleteField(section.id, field.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
                        />
                      </div>

                      {field.type === "label" && (
                        <div>
                          <Label>Style</Label>
                          <Select
                            value={field.labelStyle}
                            onValueChange={(value: "h1" | "h2" | "h3") =>
                              updateField(section.id, field.id, { labelStyle: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="h1">H1 - Large</SelectItem>
                              <SelectItem value="h2">H2 - Medium</SelectItem>
                              <SelectItem value="h3">H3 - Small</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {(field.type === "text" || field.type === "number") && (
                        <div>
                          <Label>Placeholder</Label>
                          <Input
                            value={field.placeholder || ""}
                            onChange={(e) => updateField(section.id, field.id, { placeholder: e.target.value })}
                          />
                        </div>
                      )}

                      {field.type === "enum" && (
                        <div>
                          <Label>Options (one per line)</Label>
                          <Textarea
                            value={field.options?.join("\n") || ""}
                            onChange={(e) =>
                              updateField(section.id, field.id, {
                                options: e.target.value.split("\n").filter((opt) => opt.trim()),
                              })
                            }
                          />
                        </div>
                      )}

                      {field.type !== "label" && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`required-${field.id}`}
                            checked={field.required || false}
                            onCheckedChange={(checked) =>
                              updateField(section.id, field.id, { required: checked as boolean })
                            }
                          />
                          <Label htmlFor={`required-${field.id}`}>Required</Label>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}

                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => addField(section.id, "label")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Label
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField(section.id, "text")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Text
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField(section.id, "number")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Number
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField(section.id, "boolean")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Boolean
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField(section.id, "enum")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Dropdown
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addSection} variant="outline" className="w-full bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Template</Button>
      </div>
    </div>
  )
}
