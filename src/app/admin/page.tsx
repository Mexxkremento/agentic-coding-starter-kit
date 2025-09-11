"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, FileJson, Trash2, AlertCircle, CheckCircle, Settings } from "lucide-react";

interface KnowledgeBaseItem {
  id: string;
  name: string;
  data: Record<string, unknown>;
  datasetVersion?: string;
  itemCount?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: "success" | "error", message: string } | null>(null);
  const [fileName, setFileName] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setUploadStatus({ type: "error", message: "Bitte wählen Sie eine JSON-Datei aus." });
      return;
    }

    try {
      const content = await file.text();
      const jsonData = JSON.parse(content);
      setFileName(file.name);
      setJsonContent(JSON.stringify(jsonData, null, 2));
      setUploadStatus(null);
    } catch {
      setUploadStatus({ type: "error", message: "Fehler beim Lesen der JSON-Datei. Bitte überprüfen Sie das Format." });
    }
  };

  const handleJsonInput = (value: string) => {
    setJsonContent(value);
    try {
      JSON.parse(value);
      setUploadStatus(null);
    } catch {
      // JSON is invalid, but don't show error immediately
    }
  };

  const handleSave = async () => {
    if (!fileName || !jsonContent) {
      setUploadStatus({ type: "error", message: "Bitte geben Sie einen Namen und JSON-Inhalt ein." });
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonContent);
    } catch {
      setUploadStatus({ type: "error", message: "Ungültiges JSON-Format. Bitte überprüfen Sie die Syntax." });
      return;
    }

    // Validate that it's an array of objects with pageContent and metadata
    if (!Array.isArray(parsedData)) {
      setUploadStatus({ type: "error", message: "JSON muss ein Array von Objekten sein." });
      return;
    }

    const hasValidStructure = parsedData.every(item => 
      item.pageContent && item.metadata && typeof item.pageContent === 'string'
    );

    if (!hasValidStructure) {
      setUploadStatus({ type: "error", message: "Alle Objekte müssen 'pageContent' und 'metadata' enthalten." });
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fileName,
          data: parsedData,
          updateMode: 'smart', // Smart update mode to avoid duplicates
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const { updated, added, skipped, total } = result.stats || {};
        
        let message = "Wissensbasis erfolgreich verarbeitet!";
        if (total > 0) {
          message += ` (${added || 0} hinzugefügt, ${updated || 0} aktualisiert, ${skipped || 0} übersprungen)`;
        }
        
        setUploadStatus({ type: "success", message });
        setFileName("");
        setJsonContent("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Refresh the knowledge base list
        await fetchKnowledgeBase();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload fehlgeschlagen");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Fehler beim Hochladen der Wissensbasis.";
      setUploadStatus({ type: "error", message: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  const fetchKnowledgeBase = async () => {
    try {
      const response = await fetch('/api/knowledge-base');
      if (response.ok) {
        const data = await response.json();
        setKnowledgeBase(data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Wissensbasis:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/knowledge-base/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchKnowledgeBase();
        setUploadStatus({ type: "success", message: "Wissensbasis erfolgreich gelöscht." });
      }
    } catch {
      setUploadStatus({ type: "error", message: "Fehler beim Löschen der Wissensbasis." });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Baumi Admin
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Verwalten Sie die Wissensbasis für Ihren Baumi ChatBot. 
            Laden Sie JSON-Dateien hoch, um dem Bot neue Informationen über Produkte und Services bereitzustellen.
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Wissensbasis hochladen
            </CardTitle>
            <CardDescription>
              Laden Sie eine JSON-Datei hoch. Das System erkennt automatisch Duplikate und aktualisiert nur geänderte Inhalte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {uploadStatus && (
              <Alert className={uploadStatus.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                <div className="flex items-center gap-2">
                  {uploadStatus.type === "error" ? (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <AlertDescription className={uploadStatus.type === "error" ? "text-red-700" : "text-green-700"}>
                    {uploadStatus.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">JSON-Datei auswählen</Label>
                  <Input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="filename">Name der Wissensbasis</Label>
                  <Input
                    id="filename"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="z.B. Produktkatalog 2024"
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isUploading || !fileName || !jsonContent}
                  className="w-full"
                >
                  {isUploading ? "Wird hochgeladen..." : "Wissensbasis speichern"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="json-content">JSON-Inhalt (editierbar)</Label>
                <Textarea
                  id="json-content"
                  value={jsonContent}
                  onChange={(e) => handleJsonInput(e.target.value)}
                  placeholder="JSON-Inhalt wird hier angezeigt oder kann manuell eingegeben werden..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Base List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Aktuelle Wissensbasis
            </CardTitle>
            <CardDescription>
              Übersicht aller hochgeladenen Wissensbasen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {knowledgeBase.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileJson className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Noch keine Wissensbasis hochgeladen</p>
              </div>
            ) : (
              <div className="space-y-4">
                {knowledgeBase.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileJson className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.itemCount || '0'} Einträge
                          </Badge>
                          {item.datasetVersion && (
                            <Badge variant="outline" className="text-xs">
                              Version: {item.datasetVersion}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            Erstellt: {new Date(item.createdAt).toLocaleDateString('de-DE')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Aktualisiert: {new Date(item.updatedAt).toLocaleDateString('de-DE')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>JSON-Format Beispiel</CardTitle>
            <CardDescription>
              Verwenden Sie dieses Format für Ihre Wissensbasis (Array von Objekten)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
{`[
  {
    "pageContent": "- **Tradition seit 1807** – Originalrezept\\n- Familienbetrieb in Salzwedel\\n- Spezialität: Baumkuchen in Handarbeit",
    "metadata": {
      "doc_type": "kb",
      "kb_section_title": "1. Überblick",
      "links": ["https://beispiel.de/ueber-uns/"],
      "origin": "kb",
      "dataset_version": "2025-01-01"
    }
  },
  {
    "pageContent": "Premium Baumkuchen – ca. 430g, handgefertigt",
    "metadata": {
      "product_name": "Premium Baumkuchen",
      "weight": "ca. 430g",
      "category": "Baumkuchen",
      "link": "https://shop.beispiel.de/product/premium-baumkuchen",
      "link_text": "Zum Shop",
      "example_prompts": [
        "Premium Baumkuchen bestellen",
        "Baumkuchen 430g kaufen"
      ],
      "origin": "product"
    }
  }
]`}
            </pre>
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Format-Hinweise:</strong>
                  <br />• Array von Objekten mit <code>pageContent</code> und <code>metadata</code>
                  <br />• Knowledge Base Einträge: <code>doc_type: &quot;kb&quot;</code>
                  <br />• Produkt Einträge: <code>origin: &quot;product&quot;</code> mit Links
                  <br />• Links werden automatisch in Chat-Antworten eingefügt
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Smart Update:</strong>
                  <br />• Beim erneuten Upload werden keine Duplikate erstellt
                  <br />• Inhalte werden über <code>origin_ref</code> oder <code>product_name</code> identifiziert
                  <br />• Nur geänderte Einträge werden aktualisiert
                  <br />• Neue Einträge werden hinzugefügt, unveränderte übersprungen
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}