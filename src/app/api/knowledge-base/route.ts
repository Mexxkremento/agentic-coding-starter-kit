import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { knowledgeBase, knowledgeBaseItems } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

// Helper function to create a hash from content
function createContentHash(content: string): string {
  return createHash('md5').update(content).digest('hex');
}

// Helper function to extract key information from metadata
function extractKeyInfo(metadata: Record<string, unknown>) {
  return {
    originRef: metadata.origin_ref || metadata.product_name || null,
    productName: metadata.product_name || null,
    datasetVersion: metadata.dataset_version || null
  };
}

export async function POST(req: NextRequest) {
  try {
    const { name, data, updateMode = 'replace' } = await req.json();

    if (!name || !data) {
      return Response.json(
        { error: "Name und Daten sind erforderlich" },
        { status: 400 }
      );
    }

    if (!Array.isArray(data)) {
      return Response.json(
        { error: "Daten müssen ein Array von Objekten sein" },
        { status: 400 }
      );
    }

    // Validate data structure
    for (const item of data) {
      if (!item.pageContent || !item.metadata) {
        return Response.json(
          { error: "Alle Objekte müssen 'pageContent' und 'metadata' enthalten" },
          { status: 400 }
        );
      }
    }

    // For demo purposes, we'll use a dummy user ID
    // In production, you'd get this from the authenticated session
    const userId = "demo-user";
    
    // Create overall content hash for the dataset
    const overallContentHash = createContentHash(JSON.stringify(data));
    const datasetVersion = data[0]?.metadata?.dataset_version || new Date().toISOString().split('T')[0];

    let knowledgeBaseEntry;
    const stats = { added: 0, updated: 0, skipped: 0, total: data.length };

    if (updateMode === 'smart') {
      // Check if knowledge base with same name already exists
      const existingKB = await db.select().from(knowledgeBase).where(eq(knowledgeBase.name, name)).limit(1);
      
      if (existingKB.length > 0) {
        knowledgeBaseEntry = existingKB[0];
        
        // Check if content has changed
        if (knowledgeBaseEntry.contentHash === overallContentHash) {
          return Response.json({
            message: "Keine Änderungen erkannt - Wissensbasis bereits aktuell",
            stats: { added: 0, updated: 0, skipped: data.length, total: data.length }
          });
        }

        // Get existing items for comparison
        const existingItems = await db.select().from(knowledgeBaseItems)
          .where(eq(knowledgeBaseItems.knowledgeBaseId, knowledgeBaseEntry.id));
        
        const existingItemsMap = new Map(
          existingItems.map(item => [item.contentHash, item])
        );

        // Process each new item
        for (const item of data) {
          const itemHash = createContentHash(JSON.stringify({
            pageContent: item.pageContent,
            metadata: item.metadata
          }));
          
          const keyInfo = extractKeyInfo(item.metadata);
          
          if (existingItemsMap.has(itemHash)) {
            // Item already exists with same content
            stats.skipped++;
          } else {
            // Check if item exists by origin_ref but content changed
            const existingByRef = existingItems.find(existing => 
              existing.originRef && keyInfo.originRef && existing.originRef === keyInfo.originRef
            );
            
            if (existingByRef) {
              // Update existing item
              await db.update(knowledgeBaseItems)
                .set({
                  pageContent: item.pageContent,
                  metadata: item.metadata,
                  contentHash: itemHash,
                  productName: keyInfo.productName as string,
                  updatedAt: new Date(),
                })
                .where(eq(knowledgeBaseItems.id, existingByRef.id));
              
              stats.updated++;
            } else {
              // Add new item
              await db.insert(knowledgeBaseItems).values({
                knowledgeBaseId: knowledgeBaseEntry.id,
                pageContent: item.pageContent,
                metadata: item.metadata,
                contentHash: itemHash,
                originRef: keyInfo.originRef as string,
                productName: keyInfo.productName as string,
              });
              
              stats.added++;
            }
          }
        }

        // Update knowledge base metadata
        await db.update(knowledgeBase)
          .set({
            contentHash: overallContentHash,
            datasetVersion: datasetVersion,
            itemCount: data.length.toString(),
            updatedAt: new Date(),
          })
          .where(eq(knowledgeBase.id, knowledgeBaseEntry.id));

      } else {
        // Create new knowledge base
        knowledgeBaseEntry = (await db.insert(knowledgeBase).values({
          id: crypto.randomUUID(),
          name,
          data,
          datasetVersion: datasetVersion,
          contentHash: overallContentHash,
          itemCount: data.length.toString(),
          userId,
        }).returning())[0];

        // Add all items
        for (const item of data) {
          const itemHash = createContentHash(JSON.stringify({
            pageContent: item.pageContent,
            metadata: item.metadata
          }));
          
          const keyInfo = extractKeyInfo(item.metadata);
          
          await db.insert(knowledgeBaseItems).values({
            knowledgeBaseId: knowledgeBaseEntry.id,
            pageContent: item.pageContent,
            metadata: item.metadata,
            contentHash: itemHash,
            originRef: keyInfo.originRef as string,
            productName: keyInfo.productName as string,
          });
          
          stats.added++;
        }
      }
    } else {
      // Replace mode - traditional behavior
      knowledgeBaseEntry = (await db.insert(knowledgeBase).values({
        id: crypto.randomUUID(),
        name,
        data,
        datasetVersion: datasetVersion,
        contentHash: overallContentHash,
        itemCount: data.length.toString(),
        userId,
      }).returning())[0];

      stats.added = data.length;
    }

    return Response.json({
      ...knowledgeBaseEntry,
      stats
    });

  } catch (error) {
    console.error("Error creating knowledge base:", error);
    return Response.json(
      { error: "Fehler beim Speichern der Wissensbasis" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get all knowledge base entries with item counts
    const results = await db.select({
      id: knowledgeBase.id,
      name: knowledgeBase.name,
      data: knowledgeBase.data,
      datasetVersion: knowledgeBase.datasetVersion,
      itemCount: knowledgeBase.itemCount,
      createdAt: knowledgeBase.createdAt,
      updatedAt: knowledgeBase.updatedAt,
    }).from(knowledgeBase).orderBy(knowledgeBase.updatedAt);
    
    return Response.json(results);
  } catch (error) {
    console.error("Error fetching knowledge base:", error);
    return Response.json(
      { error: "Fehler beim Laden der Wissensbasis" },
      { status: 500 }
    );
  }
}