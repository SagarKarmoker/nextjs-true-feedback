import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDB from "@/lib/dbConfig";
import UserModel from "@/model/UserModel";
import { User } from "next-auth";

export async function POST(req) {
    await connectDB();
    const session = getServerSession(authOptions)
    const user = session?.user;

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized or user not logged in" }, { status: 401 });
    }

    const userId = user._id;
    const { acceptMessages } = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMsg: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "User updated successfully and accepting msg" }, { status: 200 }, { updatedUser });

    } catch (error) {
        console.error("Error in accept-msg POST route: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function GET(req) {
    await connectDB();
    const session = getServerSession(authOptions)
    const user = session?.user;

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized or user not logged in" }, { status: 401 });
    }

    const userId = user._id;

    try {
        const existingUser = await UserModel.findById(userId);

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User found", isAcceptingMsg: existingUser.isAcceptingMsg }, { status: 200 });

    } catch (error) {
        console.error("Error in accept-msg GET route: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}