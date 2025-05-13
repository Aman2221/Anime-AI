import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs"; // use bcryptjs if using in edge runtime
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { v4 as uuid } from "uuid";

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db("users");

                const user = await db.collection("users").findOne({ email: credentials?.email });

                if (!user || !user.password) return null;

                const isValid = await compare(credentials ? credentials.password : "", user.password);

                if (!isValid) return null;

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            const client = await clientPromise;
            const db = client.db("anime-ai");
            const existingUser = await db.collection("users").findOne({ email: user.email });
            const userToStore = {
                name: user.name,
                email: user.email,
                password: "GoogleLogin",
                createdAt: new Date().toISOString(),
                uuid: uuid(),
                imgURL: user.image,
            };

            if (!existingUser) {
                await db.collection("users").insertOne(userToStore);
            }

            return true;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
