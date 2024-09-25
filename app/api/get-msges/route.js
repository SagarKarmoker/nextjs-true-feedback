import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDB from "@/lib/dbConfig";
import UserModel from "@/model/UserModel";
import mongoose from "mongoose";


// TODO: this is complex topic and needs to be revisited
export async function GET(req) {
    await connectDB();
    const session = getServerSession(authOptions)
    const user = session?.user;

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized or user not logged in" }, { status: 401 });
    }

    // convert to mongoose ObjectId
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        // aggreation pipeline to match user by id
        // converting array into object
        const existingUser = await UserModel.aggregate([
            { $match: {id: userId} },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ])

        if (!existingUser || existingUser.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        // return messages array
        return NextResponse.json({ messages: existingUser[0].messages }, { status: 200 });

    } catch (error) {
        console.error("Error in accept-msg GET route: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}