// /app/api/chat/get-messages/route.ts
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, chatId } = await req.json();
        const client = await clientPromise;
        const db = client.db(userId);

        const messages = await db
            .collection(chatId)
            .find({ meta: { $ne: true } }) // exclude metadata
            .sort({ _id: 1 }) // oldest to newest
            .toArray();

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Failed to fetch messages", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}
