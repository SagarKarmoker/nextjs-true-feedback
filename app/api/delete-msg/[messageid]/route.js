import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import connectDB from "@/lib/dbConfig";
import UserModel from "@/model/UserModel";
import { NextResponse } from "next/server";

export async function DELETE(req, params) {
    const messageId = params.messageid;

    await connectDB();
    const session = getServerSession(authOptions)
    const user = session?.user;

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized or user not logged in" }, { status: 401 });
    }

    try {
        const response = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if(response.modifiedCount === 0){
            return NextResponse.json({ message: "Message not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Message deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error in delete-msg DELETE route: ", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}