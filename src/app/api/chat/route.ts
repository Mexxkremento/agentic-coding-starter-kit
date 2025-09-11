import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { db } from "@/lib/db";
import { knowledgeBase } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Request body:", body);
    
    const { messages: inputMessages }: { messages: Array<{role: string, content: string}> } = body;

    if (!inputMessages || !Array.isArray(inputMessages)) {
      console.error("Invalid messages:", inputMessages);
      return Response.json({ error: "Messages array is required" }, { status: 400 });
    }

    console.log("Messages received:", inputMessages.length, inputMessages);

    let contextData = "";

  try {
    // Fetch from the new structured knowledge base items table
    const knowledgeEntries = await db.select({
      id: knowledgeBase.id,
      name: knowledgeBase.name,
      items: knowledgeBase.data
    }).from(knowledgeBase);
    
    if (knowledgeEntries.length > 0) {
      console.log(`Found ${knowledgeEntries.length} knowledge base entries`);
      
      let kbContent = "VERFÜGBARE PRODUKTE:\n\n";
      
      // Process all knowledge base entries
      for (const entry of knowledgeEntries) {
        try {
          const data = entry.items as Array<{
            pageContent?: string;
            metadata?: {
              product_name?: string;
              weight?: string;
              link?: string;
              kb_section_title?: string;
              price?: string;
              description?: string;
            };
          }>;
          
          if (Array.isArray(data)) {
            console.log(`Processing ${data.length} items from ${entry.name}`);
            
            // Process all items, not just first 5
            data.forEach(item => {
              try {
                if (item && item.pageContent && item.metadata) {
                  // Include product information with full details
                  if (item.metadata.product_name) {
                    kbContent += `PRODUKT: ${item.metadata.product_name}\n`;
                    if (item.metadata.weight) kbContent += `Gewicht: ${item.metadata.weight}\n`;
                    if (item.metadata.price) kbContent += `Preis: ${item.metadata.price}\n`;
                    if (item.metadata.description) kbContent += `Beschreibung: ${item.metadata.description}\n`;
                    if (item.pageContent) kbContent += `Details: ${item.pageContent}\n`;
                    if (item.metadata.link) kbContent += `Link: ${item.metadata.link}\n`;
                    kbContent += "\n";
                  } else if (item.metadata.kb_section_title) {
                    kbContent += `SECTION: ${item.metadata.kb_section_title}\n`;
                    kbContent += `Content: ${item.pageContent}\n\n`;
                  } else {
                    // Generic content
                    kbContent += `Info: ${item.pageContent.slice(0, 200)}...\n\n`;
                  }
                }
              } catch (itemError) {
                console.error("Error processing knowledge base item:", itemError);
              }
            });
          }
        } catch (entryError) {
          console.error("Error processing knowledge base entry:", entryError);
        }
      }
      
      contextData = `${kbContent}

WICHTIGE ANWEISUNGEN:
- Nutze NUR die Informationen aus der obigen Wissensbasis
- Erfinde KEINE Produktdaten (Gewichte, Preise, etc.)
- Bei Zartbitter-Baumkuchen: Verwende nur die exakten Angaben aus der Wissensbasis
- Füge Shop-Links im Format [Produktname](URL) ein wenn verfügbar
- Wenn Informationen fehlen, sage ehrlich "Das weiß ich nicht genau"
- Sei freundlich und hilfsbereit aber präzise`;
      
      console.log("Context data length:", contextData.length);
    } else {
      console.log("No knowledge base entries found");
    }
  } catch (error) {
    console.error("Error fetching knowledge base:", error);
  }

  const systemMessage = {
    role: "system" as const,
    content: `Du bist Baumi, Kundenservice-Assistent für die Erste Salzwedeler Baumkuchen-Manufaktur.

WICHTIGE REGELN:
- Nutze AUSSCHLIESSLICH Informationen aus der bereitgestellten Wissensbasis
- Erfinde NIEMALS Produktdaten, Gewichte, Preise oder andere Details
- Wenn eine Information nicht in der Wissensbasis steht, sage ehrlich "Das kann ich nicht genau sagen"
- Gib nur korrekte, verifizierte Daten weiter

Verhalten:
- Freundlich und hilfsbereit
- Deutsche Anrede, traditionsbewusst
- Bei Produktfragen: Nutze nur Daten aus der Wissensbasis

${contextData}`.slice(0, 3000),
  };

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY environment variable is not set");
      return Response.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    console.log("Creating OpenAI stream with model:", process.env.OPENAI_MODEL || "gpt-4o-mini");
    console.log("System message length:", systemMessage.content.length);
    console.log("Total messages:", inputMessages.length + 1);

    // Validate messages before converting
    const validMessages = inputMessages.filter(msg => msg && msg.role && msg.content);
    console.log("Valid messages after filtering:", validMessages.length, validMessages);

    if (validMessages.length === 0) {
      return Response.json({ error: "No valid messages found" }, { status: 400 });
    }

    // Double check validMessages is still an array
    if (!Array.isArray(validMessages)) {
      console.error("validMessages is not an array:", typeof validMessages, validMessages);
      return Response.json({ error: "Internal error: validMessages is not an array" }, { status: 500 });
    }

    console.log("About to convert messages:", validMessages);
    
    // Manual conversion with proper typing
    const convertedMessages = validMessages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));
    
    console.log("Converted messages:", convertedMessages.length, convertedMessages);

    const result = streamText({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
      messages: [systemMessage, ...convertedMessages],
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}