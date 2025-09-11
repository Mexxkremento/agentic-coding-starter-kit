"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ExternalLink } from "lucide-react";

interface PrivacyConsentProps {
  onConsent: () => void;
}

export function PrivacyConsent({ onConsent }: PrivacyConsentProps) {
  return (
    <div className="p-4 flex flex-col justify-center h-full">
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-lg">Datenschutz ist wichtig</CardTitle>
          <CardDescription className="text-sm">
            Bevor wir beginnen, benötigen wir Ihre Zustimmung zur Datenverarbeitung
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-xs text-gray-600 space-y-2">
            <p>
              Mit der Nutzung des Chats stimmen Sie der Verarbeitung Ihrer Nachrichten zu Servicezwecken zu.
            </p>
            <p>
              Ihre Daten werden DSGVO-konform verarbeitet und nicht an Dritte weitergegeben.
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <a
              href="/datenschutz"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutzerklärung lesen
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.parent?.postMessage('closeChatBubble', '*')}
            >
              Ablehnen
            </Button>
            <Button
              onClick={onConsent}
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Zustimmen & Chat starten
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}