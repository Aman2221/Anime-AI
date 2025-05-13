import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { name, email, password, createdAt, uuid, imgURL } = body;

    const client = await clientPromise;

    const db = client.db("anime-ai");

    const existingUser = await db.collection("users")
        .findOne({ email })
    if (existingUser) {
        return NextResponse.json({
            error: "User already exists"
        }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10);

    await db.collection('users').insertOne({
        name, email, createdAt, uuid, imgURL, passsword: hashedPassword
    })

    return NextResponse.json({
        message: "user registerd successfully"
    }, { status: 201 })
}