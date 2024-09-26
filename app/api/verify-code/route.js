import connectDB from "@/lib/dbConfig";
import UserModel from "@/model/UserModel";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { NextResponse } from "next/server";

const verifyCodeQuerySchema = z.object({
    verifyCode: verifySchema
});

export async function POST(req) {
    await connectDB();
    try {
        const { username, code } = await req.json();

        // check for valid code
        const result = verifyCodeQuerySchema.safeParse({ verifyCode: { code } });
        if (!result.success) {
            console.error("Error in verify-code POST route: ", result.error);
            return NextResponse.json({ message: result.error }, { status: 400 });
        }

        // use when username is encoded in the URL
        const decodedUsername = decodeURIComponent(username);

        const existingUser = await UserModel.findOne({
            username: username
        })

        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isCodeValid = existingUser.verifyCode === code;
        const isCodeNotExpired = new Date(existingUser.verifyCodeExpiry) > Date.now();

        if (isCodeValid && isCodeNotExpired) {
            existingUser.isVerified = true;
            await existingUser.save();
            return NextResponse.json({ message: "User verified" }, { status: 200 });
        }

        if (!isCodeValid || !isCodeNotExpired) {
            return NextResponse.json({ message: "Invalid or expired code" }, { status: 400 });
        }

    } catch (error) {
        console.error("Error in verify-code POST route: ", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
