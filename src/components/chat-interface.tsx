"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, User, Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hallo! 👋 Ich bin Baumi, Ihr digitaler Kundenservice-Assistent der Ersten Salzwedeler Baumkuchen-Manufaktur.

Bitte haben Sie Verständnis dafür, dass ich noch jeden Tag dazu lerne und meine Antworten daher nicht immer perfekt sind.

Wie kann ich Ihnen heute helfen? Ich kann Ihnen gerne Fragen zu unseren traditionellen Baumkuchen-Produkten beantworten, über unsere Firmengeschichte erzählen oder Sie bei der Auswahl des perfekten Baumkuchens unterstützen! 🍰`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Force immediate scroll to bottom
      container.scrollTop = container.scrollHeight;
      console.log('📜 Scrolled to bottom:', {
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight
      });
      
      // Also try scrolling the messagesEndRef into view as backup
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
      }
    }
  };

  useEffect(() => {
    console.log('📄 Messages updated, current count:', messages.length);
    console.log('🔍 Last message content:', messages[messages.length - 1]?.content?.slice(0, 50));
    
    // Only scroll to bottom if we have more than just the welcome message
    if (messages.length > 1) {
      scrollToBottom();
    } else {
      // For welcome message, scroll to top
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = 0;
        console.log('📜 Scrolled to top for welcome message');
      }
    }
  }, [messages]);

  // Ensure we start at top when component mounts
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
      console.log('📜 Initial scroll to top');
    }
  }, []);

  const sendMessage = async (userMessage: string) => {
    console.log('🚀 sendMessage called with:', userMessage);
    
    if (!userMessage.trim() || isLoading) {
      console.log('❌ Message rejected - empty or loading');
      return;
    }
    
    console.log('✅ Creating user message');
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
    };
    
    console.log('📝 Adding user message to state');
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);
    setInput('');
    
    try {
      console.log('🌐 Starting API call to /api/chat');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      
      console.log('📡 API Response received:', response.status);
      
      if (!response.ok) {
        console.error('❌ API Response not ok:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('📖 Setting up stream reader');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      };
      
      console.log('🤖 Adding empty assistant message');
      setMessages(prev => [...prev, assistantMessage]);
      
      if (reader) {
        console.log('📺 Starting stream reading loop');
        try {
          while (true) {
            console.log('🔄 Reading next chunk...');
            const { done, value } = await reader.read();
            console.log('📦 Chunk received - done:', done, 'value length:', value?.length || 0);
            
            if (done) {
              console.log('✅ Stream finished');
              // Final scroll to bottom when stream is complete
              setTimeout(scrollToBottom, 100);
              break;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            console.log('📝 Decoded chunk:', chunk);
            assistantResponse += chunk;
            console.log('💬 Total response so far:', assistantResponse.length, 'chars');
            
            setMessages(prev => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              if (updated[lastIndex] && updated[lastIndex].role === 'assistant') {
                updated[lastIndex] = { 
                  ...updated[lastIndex], 
                  content: assistantResponse,
                  id: updated[lastIndex].id // Ensure ID is preserved for React keys
                };
                console.log('🔄 Updated message content:', assistantResponse.length);
              }
              return updated;
            });
            
            // Force scroll after each update with small delay for DOM update
            setTimeout(scrollToBottom, 0);
          }
        } catch (streamError) {
          console.error('❌ Stream reading error:', streamError);
        }
      } else {
        console.error('❌ No reader available');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📤 Form submitted with input:', input);
    const message = input.trim();
    if (message) {
      console.log('📨 Calling sendMessage with:', message);
      sendMessage(message);
    } else {
      console.log('❌ Empty message, not sending');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="p-3 pb-0 overflow-y-auto h-[350px]"
        onWheel={(e: React.WheelEvent) => e.stopPropagation()}
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Fehler:</strong> {error}
            </p>
          </div>
        )}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.id}-${index}-${message.content?.length || 0}`}
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
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {message.content || "Loading..."}
                      {message.role === 'assistant' && message.content && (
                        <span className="text-xs text-gray-400 block mt-1">
                          ({message.content.length} chars)
                        </span>
                      )}
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
          <div ref={messagesEndRef} className="h-4 flex-shrink-0" />
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-3 bg-white flex-shrink-0 sticky bottom-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nachricht schreiben..."
            className="flex-1 min-h-[36px] max-h-[72px] resize-none text-sm"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-gray-400 mt-1 text-center">
          Enter = Senden
        </p>
      </div>
    </div>
  );
}