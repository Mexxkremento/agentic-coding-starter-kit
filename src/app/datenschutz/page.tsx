import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Link>
          </Button>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Datenschutzerklärung
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Informationen zur Verarbeitung Ihrer personenbezogenen Daten bei der Nutzung von Baumi ChatBot
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Verantwortlicher</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              Verantwortlicher für die Datenverarbeitung ist:
            </p>
            <p>
              <strong>Baumi ChatBot Demo</strong><br />
              Musterstraße 123<br />
              12345 Musterstadt<br />
              Deutschland<br />
              E-Mail: datenschutz@baumi-demo.de
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Erhobene Daten</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>Bei der Nutzung des ChatBots werden folgende Daten verarbeitet:</p>
            <ul>
              <li><strong>Chat-Nachrichten:</strong> Ihre Eingaben im Chat werden verarbeitet, um Ihnen passende Antworten zu geben</li>
              <li><strong>Technische Daten:</strong> IP-Adresse, Browser-Informationen, Zeitstempel der Nutzung</li>
              <li><strong>Session-Daten:</strong> Temporäre Daten zur Aufrechterhaltung der Chat-Session</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Zweck der Datenverarbeitung</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>Ihre Daten werden verarbeitet für:</p>
            <ul>
              <li>Bereitstellung des ChatBot-Services</li>
              <li>Beantwortung Ihrer Fragen und Anfragen</li>
              <li>Verbesserung der Service-Qualität</li>
              <li>Technische Funktionalität und Sicherheit</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Rechtsgrundlage</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              Die Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) 
              sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung des Services).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Speicherdauer</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              Chat-Daten werden nur für die Dauer der Session gespeichert und anschließend gelöscht. 
              Technische Logs werden maximal 30 Tage aufbewahrt.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Ihre Rechte</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>Sie haben das Recht auf:</p>
            <ul>
              <li>Auskunft über Ihre verarbeiteten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li>Beschwerde bei der Aufsichtsbehörde (Art. 77 DSGVO)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Weitergabe von Daten</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              Ihre Daten werden nicht an Dritte weitergegeben, außer zur Bereitstellung des AI-Services 
              (OpenAI) unter Einhaltung angemessener Datenschutzstandards.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Kontakt</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              Bei Fragen zum Datenschutz wenden Sie sich an: 
              <a href="mailto:datenschutz@baumi-demo.de" className="text-blue-600 hover:underline">
                datenschutz@baumi-demo.de
              </a>
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Stand: Januar 2025</p>
        </div>
      </div>
    </main>
  );
}