import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbConfig";
import UserModel from "@/model/UserModel";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";


export async function POST(req) {
    await connectDB();
    try {
        // nextjs doesn't have a built-in body parser
        const { username, email, password } = await req.json();

        const existingUsername = await UserModel.findOne({
            email: email,
            isVerified: true
        })

        if (existingUsername) {
            return NextResponse.json({ error: "Email or username already exists" }, { status: 400 });
        }

        const existingEmail = await UserModel.findOne({
            email: email
        })
        let otp = 0;
        if (existingEmail) {
            if (existingEmail.isVerified) {
                return NextResponse.json({ error: "Email already exists" }, { status: 400 });
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                otp = Math.floor(100000 + Math.random() * 900000).toString();
                existingEmail.password = hashedPassword;
                existingEmail.verifyCode = otp;
                existingEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingEmail.save();
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            otp = Math.floor(100000 + Math.random() * 900000).toString();

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: otp,
                verifyCodeExpiry: expiryDate
            });

            await newUser.save();
        }

        // send verification email
        const sendEmailResponse = await sendVerificationEmail(email, username, otp);
        console.log(sendEmailResponse)
        if (!sendEmailResponse.id) {
            return NextResponse.json({ error: "Error sending verification email" }, { status: 500 });
        }

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error in sign-up route: ", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}