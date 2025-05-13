import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;

    const client = await clientPromise;

    const db = client.db("anime-ai");

    const existingUser = await db.collection("users")
        .findOne({ email });


    if (existingUser) {
        const hashedPassword = await hash(password, 10);
        const isPasswordCorrect = await compare(password, hashedPassword);
        if (isPasswordCorrect) {
            return NextResponse.json(existingUser, { status: 200 })
        }
        else {
            return NextResponse.json({
                message: "User enter incorrect password"
            }, { status: 200 })
        }
    }


    else {
        return NextResponse.json({
            error: "No user found"
        }, { status: 400 })
    }

}