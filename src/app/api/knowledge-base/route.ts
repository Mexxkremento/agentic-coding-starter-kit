import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { knowledgeBase } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const { name, data } = await req.json();

    if (!name || !data) {
      return Response.json(
        { error: "Name und Daten sind erforderlich" },
        { status: 400 }
      );
    }

    // For demo purposes, we'll use a dummy user ID
    // In a real app, you'd get this from the session
    const userId = "demo-user";

    const result = await db.insert(knowledgeBase).values({
      id: crypto.randomUUID(),
      name,
      data,
      userId,
    }).returning();

    return Response.json(result[0]);
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
    // For demo purposes, we'll get all knowledge base entries
    // In a real app, you'd filter by user ID from the session
    const results = await db.select().from(knowledgeBase).orderBy(knowledgeBase.createdAt);
    
    return Response.json(results);
  } catch (error) {
    console.error("Error fetching knowledge base:", error);
    return Response.json(
      { error: "Fehler beim Laden der Wissensbasis" },
      { status: 500 }
    );
  }
}