import connectDB from "@/lib/dbConfig";
import UserModel from "@/model/UserModel";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signupSchema";
import { NextResponse } from "next/server";

const usernameQuerySchema = z.object({
    username: userNameValidation
});

export async function GET(req, res) {
    await connectDB();

    try {
        // localhost:3000/api/check-username?username=abc  
        const { searchParams } = new URL(req.url)
        const queryParams = {
            username: searchParams.get("username")
        }

        // Validate the query parameters using zod
        const result = usernameQuerySchema.safeParse(queryParams);
        console.log(result);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const { username } = result.data;

        const existingUser = await UserModel.findOne({
            username, isVerified: true
        })

        if (existingUser) {
            return NextResponse.json({ message: "Username already exists" }, { status: 400 });
        }

        // if username not taken
        return NextResponse.json({ message: "Username available" }, { status: 200 })

    } catch (error) {
        console.error("Error in check-username GET route: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}