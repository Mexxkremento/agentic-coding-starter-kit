"use client";

import { ChatBubble } from "@/components/chat-bubble";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageCircle, Shield, Zap, Users, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                🚀 Demo verfügbar
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Baumi ChatBot
              </h1>
              <h2 className="text-2xl font-semibold text-gray-700">
                Intelligenter Kundenservice für Baumkuchen-Liebhaber
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Entdecken Sie die Welt des traditionellen Salzwedeler Baumkuchens mit unserem KI-gesteuerten Assistenten. 
                Baumi beantwortet Ihre Fragen zu unseren handgefertigten Produkten und hilft bei der Auswahl.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="px-8 py-3 text-lg font-semibold"
                onClick={() => {
                  // Scroll to demo section
                  document.querySelector('.chat-bubble')?.scrollIntoView({ behavior: 'smooth' });
                  // Or open chat directly
                  setTimeout(() => {
                    const chatBubble = document.querySelector('[data-chat-bubble]') as HTMLElement;
                    chatBubble?.click();
                  }, 1000);
                }}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Demo starten
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 text-lg"
                onClick={() => {
                  // Scroll to features section
                  document.querySelector('.py-16.bg-white\\/50')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Mehr erfahren
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Warum Baumi ChatBot?
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Unser intelligenter Assistent verbindet Tradition mit moderner Technologie für erstklassigen Baumkuchen-Service
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>24/7 Verfügbarkeit</CardTitle>
                  <CardDescription>
                    Ihr digitaler Assistent ist rund um die Uhr für Ihre Kunden da
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Sofortige Antworten</CardTitle>
                  <CardDescription>
                    Blitzschnelle Reaktionszeiten für zufriedene Kunden
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Direkte Bestellung</CardTitle>
                  <CardDescription>
                    Produktempfehlungen mit direkten Shop-Links für einfache Bestellung
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Traditionswissen</CardTitle>
                  <CardDescription>
                    Umfassendes Wissen über Baumkuchen-Tradition und Produktvarianten
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>DSGVO-konform</CardTitle>
                  <CardDescription>
                    Vollständig datenschutzkonform entwickelt
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle>Einfache Integration</CardTitle>
                  <CardDescription>
                    Schnell und unkompliziert in Ihre Website integrierbar
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Testen Sie Baumi jetzt kostenlos!
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Klicken Sie auf die Chat-Bubble unten rechts und entdecken Sie, 
              wie Baumi Ihnen bei der Baumkuchen-Auswahl hilft
            </p>
            <div className="flex items-center justify-center">
              <div className="animate-pulse">
                <div className="w-4 h-4 bg-white rounded-full opacity-75"></div>
              </div>
              <div className="ml-2 text-lg font-medium">
                Chat-Bubble unten rechts anklicken ↘️
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Bereit für Ihren eigenen Baumi?
              </h3>
              <p className="text-xl text-gray-600 mb-8">
                Kontaktieren Sie uns für eine individuelle ChatBot-Lösung für Ihr Unternehmen
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="px-8 py-3 text-lg font-semibold"
                  onClick={() => {
                    // Open mailto link
                    window.open('mailto:info@baumi-chatbot.de?subject=Interesse an Baumi ChatBot&body=Hallo, ich interessiere mich für eine individuelle ChatBot-Lösung.', '_blank');
                  }}
                >
                  Jetzt kontaktieren
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-3 text-lg"
                  onClick={() => {
                    // Open chat with price inquiry
                    const chatBubble = document.querySelector('[data-chat-bubble]') as HTMLElement;
                    chatBubble?.click();
                    setTimeout(() => {
                      // Pre-fill with price question
                      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                      if (textarea) {
                        textarea.value = 'Was kostet ein individueller ChatBot?';
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                    }, 2000);
                  }}
                >
                  Preise ansehen
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Chat Bubble - Fixed position */}
      <ChatBubble />
    </>
  );
}