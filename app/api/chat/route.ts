import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req: NextRequest) {
    const { messages } = await req.json();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages, // array of { role: "user" | "system" | "assistant", content: string }
        });

        return NextResponse.json({ message: completion.choices[0].message });
    } catch (err) {
        console.error('OpenAI API Error:', err);
        return NextResponse.json({ error: 'Failed to fetch response from OpenAI.' }, { status: 500 });
    }
}
