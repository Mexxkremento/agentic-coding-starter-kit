import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { knowledgeBase } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await db.delete(knowledgeBase).where(eq(knowledgeBase.id, id));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting knowledge base:", error);
    return Response.json(
      { error: "Fehler beim Löschen der Wissensbasis" },
      { status: 500 }
    );
  }
}