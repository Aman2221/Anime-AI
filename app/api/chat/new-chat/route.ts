// As user clicks on start a new chat or start a new chat from prompting in the input box
// for the first time the new database will get created for that user 
// if user already a chat/db than new collection will get created for that new chat session
// inside that collection usre prompt and ai responses will be stored for that chat session
/*
    newChatSession : {
        chatName: string;
        chatId: string;
        createdAt: string;
    }
    chatObject : {
        id: string;
        provider: string;
        prompt: string | null;
        response: string;
    }
*/

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        // const raw = await req.text();
        // console.log("RAW BODY:", raw);
        const body = await req.json();
        const { chatName, userUid, chatId } = body;
        // chatId is the uniqu id for each chat session
        const chatSessionId = chatId ? chatId : uuidv4(); // unique chat session id
        const chatSessionCreatedAt = new Date().toISOString();
        const client = await clientPromise;

        //check if user already have a database or need to create a database
        const db = client.db(userUid);

        // Creating a new collection for chat sessions
        await db.collection(chatSessionId).insertOne({
            meta: true,
            chatSessionName: chatName ? chatName : "New chat",
            chatSessionId: chatSessionId,
            chatSessionCreatedAt: chatSessionCreatedAt
        })

        //
        return NextResponse.json({
            message: "New chat session created"
        }, { status: 200 })
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({
            error: "Something went wrong!"
        }, { status: 500 })
    }
}