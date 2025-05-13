import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, chatId, provider, prompt, response } = await req.json();
        const client = await clientPromise;
        const db = client.db(userId); // db is named after user ID

        const chatObject = {
            id: userId,
            chatId: chatId,
            provider: provider,
            prompt: prompt || null,
            response: response,
        };

        await db.collection(chatId).insertOne(chatObject);

        return NextResponse.json({ message: "Message added", chatObject });
    } catch (error) {
        console.error("Error adding message:", error);
        return NextResponse.json({ error: "Failed to add message" }, { status: 500 });
    }
}
