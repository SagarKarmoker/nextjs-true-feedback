import connectDB from "@/lib/dbConfig";
import UserModel from "@/model/UserModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    try {
        const { username, content } = await req.json();

        const user = await UserModel.findOne({username: username});

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if(!user.isAcceptingMsg) {
            return NextResponse.json({ error: "User not accepting messages" }, { status: 401 });
        }

        const newMessage = { content };
        user.massages.push(newMessage);
        await user.save();

        return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error in send-msg POST route: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}