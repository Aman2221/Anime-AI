import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        const client = await clientPromise;
        const db = client.db(userId);

        const collections = await db.listCollections().toArray();

        // For each collection, get the metadata document (chatName, createdAt)
        const chats = await Promise.all(
            collections.map(async (col) => {
                const meta = await db.collection(col.name).findOne({ meta: true });
                return {
                    chatId: meta?.chatSessionId,
                    chatName: meta?.chatSessionName || "Unnamed Chat",
                    createdAt: meta?.chatSessionCreatedAt || null,
                };
            })
        );

        console.log("chats :", chats)

        return NextResponse.json(chats);
    } catch (error) {
        console.error("Failed to fetch chat sessions", error);
        return NextResponse.json({ error: "Failed to fetch chat sessions" }, { status: 500 });
    }
}
