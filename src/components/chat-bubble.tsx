"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat-interface";
import { PrivacyConsent } from "@/components/privacy-consent";

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConsent = () => {
    setHasConsented(true);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          data-chat-bubble
          onClick={handleOpen}
          className="rounded-full w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Invisible overlay to prevent background scrolling */}
      <div 
        className="fixed inset-0 z-40"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.preventDefault()}
      />
      <div className="fixed bottom-4 right-4 z-50 max-w-[90vw] max-h-[90vh]">
      <div 
        className="bg-white rounded-lg shadow-2xl border w-96 max-w-full h-[480px] max-h-[90vh] flex flex-col"
        onWheel={(e) => e.stopPropagation()}
        onScroll={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">Baumi</h3>
              <p className="text-xs opacity-90">Ihr digitaler Assistent</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {!hasConsented ? (
            <PrivacyConsent onConsent={handleConsent} />
          ) : (
            <ChatInterface />
          )}
        </div>
      </div>
      </div>
    </>
  );
}