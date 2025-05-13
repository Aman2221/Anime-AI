import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { email } = body;

    const client = await clientPromise;

    const db = client.db("anime-ai");

    const existingUser = await db.collection("users")
        .findOne({ email });


    if (existingUser) {
        return NextResponse.json(
            existingUser
            , { status: 200 })
    }


    else {
        return NextResponse.json({
            error: "No user found"
        }, { status: 400 })
    }

}