"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Bot, User, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function ChatInterface() {
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!hasStarted) {
      // Add welcome message from Baumi
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hallo! 👋 Ich bin Baumi, Ihr digitaler Kundenservice-Assistent der Ersten Salzwedeler Baumkuchen-Manufaktur.

Bitte haben Sie Verständnis dafür, dass ich noch jeden Tag dazu lerne und meine Antworten daher nicht immer perfekt sind.

Wie kann ich Ihnen heute helfen? Ich kann Ihnen gerne Fragen zu unseren traditionellen Baumkuchen-Produkten beantworten, über unsere Firmengeschichte erzählen oder Sie bei der Auswahl des perfekten Baumkuchens unterstützen! 🍰`,
        },
      ]);
      setHasStarted(true);
    }
  }, [hasStarted, setMessages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message: any) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[85%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                } gap-3`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <Card
                  className={`${
                    message.role === "user"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="text-sm">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`underline font-medium ${
                                message.role === "user"
                                  ? "text-blue-100 hover:text-white"
                                  : "text-blue-600 hover:text-blue-800"
                              }`}
                            >
                              {children} 🔗
                            </a>
                          ),
                        }}
                      >
{message.content}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Baumi tippt...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Schreiben Sie Ihre Nachricht..."
            className="flex-1 min-h-[40px] max-h-[100px] resize-none"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Drücken Sie Enter zum Senden, Shift+Enter für neue Zeile
        </p>
      </div>
    </div>
  );
}