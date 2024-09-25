import connectDB from "@/lib/dbConfig";
import UserModel from "@/model/UserModel";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { NextResponse } from "next/server";

// TODO: validate using zod

const verifyCodeQuerySchema = z.object({
    verifyCode: verifySchema
});

export async function POST(req) {
    await connectDB();
    try {
        const { username, code } = await req.json();

        // check for valid code
        const result = verifyCodeQuerySchema.safeParse({ verifyCode: code });
        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        // use when username is encoded in the URL
        const decodedUsername = decodeURIComponent(username);

        const existingUser = await UserModel.findOne({
            username: username
        })

        if(!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isCodeValid = existingUser.verifyCode === code;
        const isCodeNotExpired = new Date(existingUser.verifyCodeExpiry) > new Date.now();
        
        if(isCodeValid && isCodeNotExpired){
            existingUser.isVerified = true;
            await existingUser.save();
            return NextResponse.json({ message: "User verified" }, { status: 200 });
        }

        if(!isCodeValid || !isCodeNotExpired){
            return NextResponse.json({ error: "Invalid or expired code" }, { status : 400 });
        }

    } catch (error) {
        console.error("Error in verify-code POST route: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
