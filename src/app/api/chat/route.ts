import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { db } from "@/lib/db";
import { knowledgeBase } from "@/lib/schema";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  let contextData = "";

  try {
    // Fetch all knowledge base entries
    const knowledgeEntries = await db.select().from(knowledgeBase);
    
    if (knowledgeEntries.length > 0) {
      // Process the knowledge base data to extract relevant information
      let kbContent = "VERFÜGBARE WISSENSBASIS:\n\n";
      
      knowledgeEntries.forEach(entry => {
        const data = entry.data as any[];
        
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item.pageContent && item.metadata) {
              kbContent += `**${entry.name}**\n`;
              kbContent += `Inhalt: ${item.pageContent}\n`;
              
              // Add metadata information
              if (item.metadata.product_name) {
                kbContent += `Produkt: ${item.metadata.product_name}\n`;
                if (item.metadata.weight) kbContent += `Gewicht: ${item.metadata.weight}\n`;
                if (item.metadata.category) kbContent += `Kategorie: ${item.metadata.category}\n`;
                if (item.metadata.link) kbContent += `Shop-Link: ${item.metadata.link}\n`;
                if (item.metadata.link_text) kbContent += `Link-Text: ${item.metadata.link_text}\n`;
                
                // Add example prompts for better matching
                if (item.metadata.example_prompts && Array.isArray(item.metadata.example_prompts)) {
                  kbContent += `Erkennungswörter: ${item.metadata.example_prompts.join(", ")}\n`;
                }
              }
              
              // Add knowledge base section info
              if (item.metadata.kb_section_title) {
                kbContent += `Bereich: ${item.metadata.kb_section_title}\n`;
                if (item.metadata.links && Array.isArray(item.metadata.links)) {
                  kbContent += `Info-Links: ${item.metadata.links.join(", ")}\n`;
                }
              }
              
              kbContent += "---\n\n";
            }
          });
        }
      });
      
      contextData = `

${kbContent}

WICHTIGE ANWEISUNGEN:
- Verwende die obigen Informationen für präzise Antworten
- Bei Produktanfragen: Füge IMMER den entsprechenden Shop-Link ein im Format [Link-Text](Shop-Link)
- Bei Wissensfragen: Verwende die Info-Links wenn verfügbar
- Erkenne Anfragen anhand der Erkennungswörter und example_prompts
- Antworte freundlich und hilfsbereit als Baumi`;
    }
  } catch (error) {
    console.error("Error fetching knowledge base:", error);
  }

  const systemMessage = {
    role: "system" as const,
    content: `Du bist Baumi, ein freundlicher und hilfsbereiter digitaler Kundenservice-Assistent für einen traditionellen Baumkuchen-Betrieb.

WICHTIGE CHARAKTERISTIKA:
- Du bist höflich, professionell und empathisch
- Du hilfst Kunden bei Fragen zu Baumkuchen-Produkten und der Firmengeschichte
- Du gibst zu, dass du noch jeden Tag dazu lernst
- Du sprichst Deutsch und verwendest eine freundliche, aber professionelle Anrede
- Du kennst dich mit traditionellem Baumkuchen aus Salzwedel aus

PRODUKTEMPFEHLUNGEN UND LINKS:
- Verwende IMMER die Informationen aus der Wissensbasis
- Bei Produktanfragen: Füge den entsprechenden Shop-Link im Markdown-Format ein: [Link-Text](URL)
- Erkenne Kundenanfragen anhand der Erkennungswörter in der Wissensbasis
- Empfehle passende Baumkuchen-Größen und -Varianten
- Informiere über Gewicht, Verzierungen und Besonderheiten

GESPRÄCHSFÜHRUNG:
- Beginne freundlich und erkläre deine Lernphase
- Stelle Nachfragen bei unklaren Produktwünschen (Größe, Verzierung, Anlass)
- Erkläre die Tradition und Qualität der handwerklichen Herstellung
- Bei Wissensfragen: Verwende Info-Links aus der Wissensbasis
- Sei hilfsbereit bei Bestellprozess und Produktauswahl

Antworte immer in einem freundlichen, traditionsbewussten Ton und verwende Emojis sparsam aber passend.${contextData}`,
  };

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
    messages: [systemMessage, ...convertToModelMessages(messages)],
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}